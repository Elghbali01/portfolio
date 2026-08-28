export default function AnimatedBackground() {
  return (
    <div
      className="ambient-background fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E1B4B]"
      aria-hidden="true"
    >
      <div className="ambient-orb ambient-orb-purple" />
      <div className="ambient-orb ambient-orb-blue" />
    </div>
  );
}
