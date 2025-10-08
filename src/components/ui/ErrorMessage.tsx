export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="text-center text-red-400 py-20">
      <p>{message}</p>
    </div>
  );
}
