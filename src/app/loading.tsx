export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F6]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[rgba(15,15,14,0.1)] border-t-[#0F0F0E]" />
        <p
          className="text-sm font-medium text-[#7A7870]"
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
