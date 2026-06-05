import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton = ({ count = 4 }: ProductCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-card rounded-lg border border-border overflow-hidden">
          <Skeleton className="w-full aspect-square" />
          <div className="p-2 xs:p-3 md:p-4 space-y-1.5 xs:space-y-2 md:space-y-3">
            <Skeleton className="h-3 xs:h-3.5 md:h-4 w-3/4" />
            <Skeleton className="h-2.5 xs:h-3 md:h-3 w-full" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 xs:h-5 md:h-5 w-1/3" />
              <Skeleton className="h-6 xs:h-7 md:h-8 w-6 xs:w-7 md:w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

interface ProductDetailSkeletonProps {}

export const ProductDetailSkeleton = ({}: ProductDetailSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 md:gap-10">
      <div className="space-y-3 xs:space-y-4 md:space-y-4">
        <Skeleton className="aspect-[4/3] w-full rounded-lg xs:rounded-lg md:rounded-xl" />
        <div className="grid grid-cols-4 gap-1.5 xs:gap-2 md:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square" />
          ))}
        </div>
      </div>
      <div className="space-y-3 xs:space-y-4 md:space-y-4">
        <Skeleton className="h-7 xs:h-8 md:h-8 w-3/4" />
        <div className="flex items-center gap-2 xs:gap-3 md:gap-4">
          <Skeleton className="h-5 xs:h-6 md:h-6 w-20 xs:w-24 md:w-24" />
          <Skeleton className="h-3 xs:h-4 md:h-4 w-24 xs:w-32 md:w-32" />
        </div>
        <Skeleton className="h-7 xs:h-8 md:h-8 w-1/3" />
        <Skeleton className="h-5 xs:h-6 md:h-6 w-full" />
        <Skeleton className="h-16 xs:h-18 md:h-20 w-full" />
        <Skeleton className="h-10 xs:h-10 md:h-12 w-full" />
        <div className="flex gap-2 xs:gap-3 md:gap-3">
          <Skeleton className="h-10 xs:h-10 md:h-12 flex-1" />
          <Skeleton className="h-10 xs:h-10 md:h-12 w-10 xs:w-12 md:w-12" />
        </div>
      </div>
    </div>
  );
};

interface CartItemSkeletonProps {
  count?: number;
}

export const CartItemSkeleton = ({ count = 3 }: CartItemSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-2 xs:gap-3 md:gap-4 p-2 xs:p-3 md:p-4 border-b border-border">
          <Skeleton className="w-20 xs:w-24 md:w-24 h-20 xs:h-24 md:h-24 rounded-lg" />
          <div className="flex-1 space-y-2 xs:space-y-2.5 md:space-y-3">
            <Skeleton className="h-4 xs:h-4.5 md:h-5 w-3/4" />
            <Skeleton className="h-3 xs:h-3.5 md:h-4 w-full" />
            <Skeleton className="h-3 xs:h-3.5 md:h-4 w-1/2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 xs:h-8 md:h-8 w-20 xs:w-24 md:w-24" />
              <Skeleton className="h-6 xs:h-7 md:h-8 w-6 xs:w-7 md:w-8" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};