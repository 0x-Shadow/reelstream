import React from "react";

export function Skeleton({ className = "" }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-white/10 ${className}`} />;
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[68vh] min-h-[460px] w-full overflow-hidden sm:h-[72vh] md:h-[76vh] md:min-h-[560px]">
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
      <div className="absolute bottom-24 left-4 z-10 w-[85%] space-y-3 sm:left-6 md:bottom-28 md:left-16 md:w-1/2 md:max-w-xl">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-full sm:h-10 md:h-12" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-28 rounded-md" />
          <Skeleton className="h-11 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function RowSkeleton({ variant = "poster" }) {
  const width = variant === "poster" ? "w-28 sm:w-36 md:w-44" : "w-44 sm:w-64 md:w-80";
  const ratio = variant === "poster" ? "aspect-[2/3]" : "aspect-video";
  return (
    <div className="flex gap-3 overflow-hidden px-3 md:gap-5 md:px-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={`shrink-0 ${width}`}>
          <Skeleton className={`w-full ${ratio}`} />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function GridSkeleton({ count = 18 }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[2/3] w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <Skeleton className="h-56 w-full rounded-none sm:h-72 md:h-96" />
      <div className="space-y-4 p-5 md:p-8">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-11 w-32 rounded-md" />
          <Skeleton className="h-11 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
