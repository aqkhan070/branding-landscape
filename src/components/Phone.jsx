/** Phone bezel wrapping a VIP mobile module shot. */
export function Phone({ screen, className = "", label }) {
  const shot = screen.shot || screen.id;
  return (
    <div className={`phone ${className}`} role="img" aria-label={label || `Phone showing ${screen.title}`}>
      <span className="phone-btn b1" aria-hidden="true" />
      <span className="phone-btn b2" aria-hidden="true" />
      <span className="phone-btn b3" aria-hidden="true" />
      <div className="phone-body">
        <span className="phone-island" aria-hidden="true" />
        <div className="ph-shot">
          <img src={`/mobile/${shot}.webp`} alt="" draggable={false} />
        </div>
      </div>
    </div>
  );
}
