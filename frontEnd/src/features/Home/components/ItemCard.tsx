import { Link } from "react-router-dom";

export const ItemCard = ({
  image,
  title,
  link,
  scrollTo,
}: {
  image: string;
  link?: string;
  scrollTo?: string;
  title: string;
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (scrollTo) {
      e.preventDefault();
      const target = document.getElementById(scrollTo);

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  if (scrollTo) {
    return (
      <button
        className="flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105 p-4"
        onClick={handleClick}
      >
        <div className="flex items-center justify-center bg-gray-100 rounded-full w-26 h-26">
          <div className="w-16 h-16">
            <img
              alt={title}
              className="object-contain w-full h-full"
              src={image}
            />
          </div>
        </div>
        <p className="text-lg font-normal text-center">{title}</p>
      </button>
    );
  }

  return (
    <Link
      className="flex flex-col items-center justify-center gap-4 transition-transform hover:scale-105 p-4"
      to={link!}
    >
      <div className="flex items-center justify-center bg-gray-100 rounded-full w-26 h-26">
        <div className="w-16 h-16">
          <img
            alt={title}
            className="object-contain w-full h-full"
            src={image}
          />
        </div>
      </div>
      <p className="text-lg font-normal text-center">{title}</p>
    </Link>
  );
};
