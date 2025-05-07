export function Conversation({
  conversation,
  stopConversation,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversation?: any;
  stopConversation: () => void;
}) {
  const statusColor =
    conversation.status === "connected"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="max-w-md mx-auto mt-6 p-6 rounded-2xl shadow-xl bg-white space-y-6 border border-gray-200">
    

      <div className="text-center">
        <p
          className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${statusColor}`}
        >
          Status: {conversation.status}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Inteviewer is currently{" "}
          <span className="font-medium">
            {conversation.isSpeaking ? "speaking" : "listening"}
          </span>
          .
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={stopConversation}
          disabled={conversation.status !== "connected"}
          className="px-3 py-1 rounded-lg bg-red-600 text-white font-semibold shadow-md transition hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Stop Conversation
        </button>
      </div>
    </div>
  );
}
