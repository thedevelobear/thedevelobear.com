/** An unconfirmed fact. CI blocks the release while any "[TODO:" is rendered. */
export function Todo({ children }: { children: string }) {
  return (
    <mark className="bg-sheet box-decoration-clone px-1.5 py-0.5 text-ink outline-2 outline-ink outline-dashed -outline-offset-2">
      {`[TODO: ${children}]`}
    </mark>
  );
}
