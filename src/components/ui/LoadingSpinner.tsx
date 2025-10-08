export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      <div
        className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 shadow-[0px_0px_50px_1px_#2c5282]"/>
    </div>
  );
}