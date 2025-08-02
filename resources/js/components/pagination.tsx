import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    return (
        <nav>
            <div className="flex space-x-1">
                {links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url || '#'}
                        className={`rounded px-3 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </nav>
    );
}
