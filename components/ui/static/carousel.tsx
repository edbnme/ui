/**
 * Carousel — Accessible carousel with touch/swipe, loop mode, and keyboard nav.
 * Built on Embla Carousel.
 *
 * @example
 * <Carousel>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *   </CarouselContent>
 *   <CarouselPrevious />
 *   <CarouselNext />
 * </Carousel>
 *
 * @see https://www.embla-carousel.com
 */
"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { createComponentContext } from "@/lib/create-component-context";

// ---- TYPES ------------------------------------------------------------------

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  currentSlide: number;
  totalSlides: number;
} & CarouselProps;

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

// ---- CONTEXT ----------------------------------------------------------------

const [CarouselProvider, useCarousel] =
  createComponentContext<CarouselContextProps>("Carousel");

// ---- CAROUSEL ROOT ----------------------------------------------------------

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [totalSlides, setTotalSlides] = React.useState(0);

    const onSelect = React.useCallback((emblaApi: CarouselApi) => {
      if (!emblaApi) return;
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setCurrentSlide(emblaApi.selectedScrollSnap() + 1);
      setTotalSlides(emblaApi.scrollSnapList().length);
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    React.useEffect(() => {
      if (!api || !setApi) return;
      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) return;
      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselProvider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
          currentSlide,
          totalSlides,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselProvider>
    );
  }
);
Carousel.displayName = "Carousel";

// ---- CAROUSEL CONTENT -------------------------------------------------------

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation, currentSlide, totalSlides } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
      {totalSlides > 0 && (
        <div aria-live="polite" className="sr-only">
          Slide {currentSlide} of {totalSlides}
        </div>
      )}
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

// ---- CAROUSEL ITEM ----------------------------------------------------------

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  );
});
CarouselItem.displayName = "CarouselItem";

// ---- CAROUSEL PREVIOUS ------------------------------------------------------

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute inline-flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background shadow-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <CaretLeft className="h-4 w-4" />
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

// ---- CAROUSEL NEXT ----------------------------------------------------------

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      className={cn(
        "absolute inline-flex h-8 w-8 items-center justify-center rounded-full border border-input bg-background shadow-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <CaretRight className="h-4 w-4" />
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

// ---- EXPORTS ----------------------------------------------------------------

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
