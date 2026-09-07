export default function PromotionalBanner() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-sidebar text-sidebar-foreground p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Get the very best apps for your store
          </h2>
          <p className="text-sidebar-foreground/70 mt-1 text-sm sm:text-base">
            Upgrade to the new checkout automation.
          </p>
          <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm sm:text-base">
            Find App
          </button>
        </div>
      </div>
    </div>
  );
}