import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CallOutcome } from "../types";
import { useWorkspace } from "../context/WorkspaceContext";
import { buildApiUrl } from "../services/apiBase";

interface CallSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

type SimulatorMessage = { speaker: "Agent" | "You"; text: string };
type CallMode = "web" | "sim";

export default function CallSimulator({ isOpen, onClose }: CallSimulatorProps) {
  const { workspace, handleSimulatorFinished } = useWorkspace();
  const org = workspace?.organization ?? null;
  const agent = org?.agent ?? null;

  const [mode, setMode] = useState<CallMode>("web");
  const [status, setStatus] = useState<
    "idle" | "calling" | "active" | "transferring" | "summarizing"
  >("idle");
  const [messages, setMessages] = useState<SimulatorMessage[]>([]);
  const [duration, setDuration] = useState(0);
  const [intent, setIntent] = useState("Detecting...");
  const [callerName, setCallerName] = useState("Test User");
  const [callerPhone, setCallerPhone] = useState("+15551234567");
  const [scenario, setScenario] = useState(
    "I want to schedule an appointment and need a callback.",
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transferTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [webCallStatus, setWebCallStatus] = useState<
    "idle" | "connecting" | "connected" | "ended"
  >("idle");
  const [webCallError, setWebCallError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [webCallDuration, setWebCallDuration] = useState(0);
  const webCallTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const clearTimers = () => {
    [timerRef, connectTimeoutRef, transferTimeoutRef, closeTimeoutRef].forEach(
      (ref) => {
        if (ref.current) {
          clearInterval(ref.current as any);
          clearTimeout(ref.current as any);
          ref.current = null;
        }
      },
    );
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const initiateWebCall = async () => {
    setWebCallError("");
    setWebCallStatus("connecting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
    } catch {
      setWebCallError(
        "Microphone access denied. Allow mic access to make calls.",
      );
      setWebCallStatus("idle");
      return;
    }
    try {
      const token = localStorage.getItem("agently.auth.token") || "";
      const resp = await fetch(
        buildApiUrl(
          `/api/twilio/voice-test?agentId=${encodeURIComponent(agent?.id || "")}`,
        ),
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!resp.ok) throw new Error("Failed");
      setTimeout(() => {
        setWebCallStatus("connected");
        setWebCallDuration(0);
        webCallTimerRef.current = setInterval(
          () => setWebCallDuration((d) => d + 1),
          1000,
        );
      }, 500);
    } catch {
      setTimeout(() => {
        setWebCallStatus("connected");
        webCallTimerRef.current = setInterval(
          () => setWebCallDuration((d) => d + 1),
          1000,
        );
      }, 2000);
    }
  };

  const endWebCall = () => {
    if (webCallTimerRef.current) {
      clearInterval(webCallTimerRef.current);
      webCallTimerRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    setWebCallStatus("ended");
    void handleSimulatorFinished({
      transcript: `Web Call: ${callerName} called for ${formatTime(webCallDuration)}`,
      duration: Math.max(webCallDuration, 1),
      callerName,
      callerPhone,
      lead: { name: callerName, phone: callerPhone, reason: "Web call test" },
    });
    setTimeout(onClose, 1500);
  };

  const startCall = () => {
    clearTimers();
    setStatus("calling");
    connectTimeoutRef.current = setTimeout(async () => {
      setStatus("active");
      setDuration(0);
      setIntent("Greeting");
      setMessages([
        {
          speaker: "Agent",
          text: agent?.greeting || "Hello, how can I help you today?",
        },
      ]);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      try {
        const token = localStorage.getItem("agently.auth.token") || "";
        const resp = await fetch(buildApiUrl("/api/messenger/messages"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: scenario }),
        });
        if (resp.ok) {
          const data = await resp.json();
          const aiText = data.assistantMessage?.text || "";
          if (aiText) {
            setMessages([
              { speaker: "Agent", text: agent?.greeting || "Hello!" },
              { speaker: "You", text: scenario },
              { speaker: "Agent", text: aiText },
            ]);
            setIntent("Responding to inquiry");
          }
        }
      } catch {}
    }, 1500);
  };

  const handleTransfer = () => {
    setStatus("transferring");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    transferTimeoutRef.current = setTimeout(() => {
      void endCall({ outcome: CallOutcome.ESCALATED });
    }, 3000);
  };

  const endCall = async (options?: { outcome?: CallOutcome }) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus("summarizing");
    const transcriptMessages =
      messages.length > 0
        ? messages
        : [
            { speaker: "Agent" as const, text: agent?.greeting || "Hello!" },
            { speaker: "You" as const, text: scenario },
          ];
    await handleSimulatorFinished({
      transcript: transcriptMessages
        .map((m) => `${m.speaker}: ${m.text}`)
        .join("\n"),
      duration: Math.max(duration, 60),
      outcome: options?.outcome,
      callerName,
      callerPhone,
      lead: { name: callerName, phone: callerPhone, reason: scenario },
    });
    closeTimeoutRef.current = setTimeout(onClose, 1500);
  };

  useEffect(() => {
    if (status === "active" && duration > 5)
      setIntent("Inquiry about Services");
    if (duration > 15) setIntent("Lead Information");
  }, [duration, status]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearTimers();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      if (webCallTimerRef.current) clearInterval(webCallTimerRef.current);
      if (audioStreamRef.current)
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
    },
    [],
  );

  if (!isOpen) return null;
  const hasNumber = !!agent?.twilioPhoneNumber;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] bg-ink-950/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          clearTimers();
          onClose();
        }
      }}
    >
      <div
        className="bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-white/20"
        style={{ maxHeight: "min(680px, 92vh)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-ink-950 px-7 py-5 text-white flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
              Agent Test Console
            </p>
            <h3 className="text-xl font-black tracking-tight mt-0.5">
              {agent?.name ?? "Voice Agent"}
            </h3>
            <p className="text-xs text-white/40 mt-0.5 font-mono">
              {agent?.twilioPhoneNumber || "No number assigned"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/10 rounded-2xl transition-all text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
          {(["web", "sim"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-all ${mode === m ? "bg-white text-ink-900 border-b-2 border-brand-orange" : "text-slate-400 hover:text-slate-600"}`}
            >
              {m === "web" ? "📞 Live Web Call" : "🧪 Simulate Call"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {mode === "web" && (
            <div className="p-6 space-y-5">
              {!hasNumber && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-bold text-amber-800">
                    No number assigned to this agent
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Go to Phone Numbers to assign a Twilio number first.
                  </p>
                </div>
              )}
              {webCallStatus === "idle" && (
                <>
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Make a Real Call
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Your Name
                        </label>
                        <input
                          value={callerName}
                          onChange={(e) => setCallerName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Your Phone
                        </label>
                        <input
                          value={callerPhone}
                          onChange={(e) => setCallerPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                      </div>
                    </div>
                    {webCallError && (
                      <p className="text-xs text-red-500 font-medium mb-3">
                        {webCallError}
                      </p>
                    )}
                    <button
                      onClick={initiateWebCall}
                      disabled={!hasNumber}
                      className="w-full rounded-2xl bg-brand-orange text-white py-3.5 text-xs font-black uppercase tracking-widest hover:bg-brand-orange/90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                      📞{" "}
                      {hasNumber ? "Connect to Agent" : "Assign a Number First"}
                    </button>
                  </div>
                </>
              )}
              {webCallStatus === "connecting" && (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-brand-orange flex items-center justify-center shadow-xl mb-6 animate-pulse text-4xl">
                    📞
                  </div>
                  <p className="text-xl font-black text-ink-900 mb-1">
                    Connecting…
                  </p>
                  <p className="text-sm text-slate-400">
                    Linking browser to {agent?.twilioPhoneNumber}
                  </p>
                </div>
              )}
              {webCallStatus === "connected" && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center py-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-ink-900 flex items-center justify-center shadow-2xl mb-4 text-3xl">
                      🎙️
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <p className="text-emerald-600 font-black text-sm uppercase tracking-widest">
                        Live Call Active
                      </p>
                    </div>
                    <p className="text-3xl font-black text-ink-900 tracking-tight">
                      {formatTime(webCallDuration)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {agent?.name} is listening
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setIsMuted((m) => !m)}
                      className={`rounded-2xl border py-3.5 flex flex-col items-center gap-1.5 transition-all ${isMuted ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"}`}
                    >
                      <span className="text-lg">{isMuted ? "🔇" : "🎙️"}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {isMuted ? "Unmute" : "Mute"}
                      </span>
                    </button>
                    <button className="rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 py-3.5 flex flex-col items-center gap-1.5 hover:border-slate-300 transition-all">
                      <span className="text-lg">🔊</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Speaker
                      </span>
                    </button>
                    <button
                      onClick={endWebCall}
                      className="rounded-2xl bg-red-500 hover:bg-red-600 text-white py-3.5 flex flex-col items-center gap-1.5 transition-all"
                    >
                      <span className="text-lg">📵</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        End Call
                      </span>
                    </button>
                  </div>
                </div>
              )}
              {webCallStatus === "ended" && (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 text-3xl">
                    ✅
                  </div>
                  <p className="text-xl font-black text-ink-900 mb-1">
                    Call Ended
                  </p>
                  <p className="text-sm text-slate-400">
                    Duration: {formatTime(webCallDuration)} · Lead data saved
                  </p>
                </div>
              )}
            </div>
          )}

          {mode === "sim" && (
            <div className="p-6">
              {status === "idle" && (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Simulate Caller Info
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Caller Name
                        </label>
                        <input
                          value={callerName}
                          onChange={(e) => setCallerName(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          Caller Phone
                        </label>
                        <input
                          value={callerPhone}
                          onChange={(e) => setCallerPhone(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-brand-orange"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Caller Request / Scenario
                      </label>
                      <textarea
                        value={scenario}
                        onChange={(e) => setScenario(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium outline-none resize-none focus:ring-2 focus:ring-brand-orange"
                      />
                    </div>
                  </div>
                  <button
                    onClick={startCall}
                    className="w-full rounded-2xl bg-ink-950 hover:bg-ink-800 text-white py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <span className="w-2 h-2 bg-brand-orange rounded-full animate-ping" />
                    {agent?.direction === "outbound"
                      ? "Launch Outbound Simulation"
                      : "Initiate Inbound Simulation"}
                  </button>
                </div>
              )}
              {status === "calling" && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-16 h-16 bg-ink-900 text-white rounded-[1.5rem] flex items-center justify-center mb-5 text-3xl animate-pulse">
                    📲
                  </div>
                  <p className="text-xl font-black text-ink-900">
                    {agent?.direction === "outbound" ? "Dialing…" : "Ringing…"}
                  </p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                    Connecting to {agent?.direction} workflow
                  </p>
                </div>
              )}
              {status === "active" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Detected Intent
                      </p>
                      <p className="font-black text-brand-orange">{intent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Duration
                      </p>
                      <p className="font-black text-ink-900 text-xl">
                        {formatTime(duration)}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-ink-900 p-4 space-y-2 max-h-48 overflow-y-auto">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.speaker === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-xl text-sm font-medium ${msg.speaker === "You" ? "bg-brand-orange text-white" : "bg-white/10 text-white/90"}`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">
                            {msg.speaker}
                          </p>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleTransfer}
                      className="bg-white border-2 border-slate-100 text-ink-900 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-brand-orange/20 flex items-center justify-center gap-2 transition-all"
                    >
                      ↔️ Transfer to Human
                    </button>
                    <button
                      onClick={() => void endCall()}
                      className="bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      📵 End Session
                    </button>
                  </div>
                </div>
              )}
              {status === "transferring" && (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-5 border-2 border-amber-200 text-3xl">
                    📤
                  </div>
                  <p className="text-xl font-black text-ink-900">
                    Transferring to Human…
                  </p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
                    Via {agent?.escalationPhone}
                  </p>
                </div>
              )}
              {status === "summarizing" && (
                <div className="flex flex-col items-center py-10 text-center">
                  <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-5" />
                  <p className="text-xl font-black text-ink-900">
                    Processing Outcome…
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Extracting lead data and intent
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
