import { assets } from "@/assets/assets";

export const SectionInfoPertanianCard = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => {
  return (
    <div
      className="relative flex flex-col items-start justify-center w-[95%] sm:w-11/12 px-6 sm:px-12 lg:px-20 mx-auto text-center sm:text-left bg-center bg-cover -top-8 sm:-top-12 lg:-top-15 rounded-2xl lg:rounded-3xl h-48 sm:h-64 lg:h-80"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(17, 103, 177, 1) 0%, rgba(17, 103, 177, .3) 50%, rgba(17, 103, 177, 0) 80%),
          url(${assets.imageInfoPertanian})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay untuk mengatur kontras teks */}
      <div className="absolute inset-0 bg-black/10 rounded-2xl lg:rounded-3xl" />

      <div className="relative z-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-lg lg:text-xl font-medium text-white/95">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
