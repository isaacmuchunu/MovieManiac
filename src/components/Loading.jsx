const Loading = () => {
  return (
    <div className="fixed inset-0 bg-netflix-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {/* Netflix-style loading animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-netflix-medium-gray rounded-full animate-spin border-t-netflix-red"></div>
        </div>
        <span className="text-netflix-red text-2xl font-bold tracking-wide">MOVIEMANIA</span>
      </div>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[160px] md:w-[200px] lg:w-[240px]">
    <div className="aspect-video skeleton rounded-md"></div>
  </div>
);

export const SkeletonRow = ({ title }) => (
  <div className="mb-8">
    <div className="h-8 w-48 skeleton rounded mb-4 mx-4 md:mx-14"></div>
    <div className="flex gap-2 overflow-hidden px-4 md:px-14">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

export const SkeletonHero = () => (
  <div className="relative h-[85vh] bg-netflix-dark-gray animate-pulse">
    <div className="absolute bottom-1/4 left-4 md:left-14 space-y-4">
      <div className="h-12 w-96 bg-netflix-medium-gray rounded"></div>
      <div className="h-6 w-80 bg-netflix-medium-gray rounded"></div>
      <div className="h-24 w-[500px] max-w-full bg-netflix-medium-gray rounded"></div>
      <div className="flex gap-4">
        <div className="h-12 w-32 bg-netflix-medium-gray rounded"></div>
        <div className="h-12 w-40 bg-netflix-medium-gray rounded"></div>
      </div>
    </div>
  </div>
);

export const SkeletonPage = () => (
  <div className="min-h-screen bg-netflix-black">
    <SkeletonHero />
    <div className="relative -mt-32 z-10 space-y-8">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  </div>
);

export default Loading;
