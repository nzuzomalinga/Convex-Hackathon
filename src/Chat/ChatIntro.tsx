export function ChatIntro() {
  return (
    <div className="flex items-start justify-between border-b py-4">
      <div className="container flex flex-col gap-2">
        <h1 className=" text-lg font-semibold md:text-2xl">Gaza Chat</h1>
        <p className="hidden sm:block text-sm text-muted-foreground">
          Open this app in multiple browser windows to see the real-time
          gaza strip resource conversations.
        </p>
      </div>
    </div>
  );
}
