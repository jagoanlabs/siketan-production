import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string; // opsional, kalau tidak ada berarti itu text terakhir
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
        {items[items.length - 1]?.label}
      </h2>
      <nav>
        <ol className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.to ? (
                <Link
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-sm text-gray-800 dark:text-white/90">
                  {item.label}
                </span>
              )}

              {index < items.length - 1 && (
                <svg
                  className="stroke-current mx-1"
                  fill="none"
                  height="16"
                  viewBox="0 0 17 16"
                  width="17"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                    stroke=""
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.2"
                  />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
