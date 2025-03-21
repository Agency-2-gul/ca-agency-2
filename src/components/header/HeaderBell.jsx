import { FaBell } from 'react-icons/fa';

export default function Bell() {
  return (
    <>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#E64D20" offset="0%" /> {/* Tailwind blue-500 */}
            <stop stopColor="#F67B39" offset="100%" />{' '}
            {/* Tailwind purple-500 */}
          </linearGradient>
        </defs>
      </svg>
      <FaBell className="text-lg " style={{ fill: 'url(#gradientId)' }} />
    </>
  );
}
