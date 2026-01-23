export function InvitationSkeleton() {
    return (
        <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-6">
            <div className="w-full max-w-lg space-y-12 text-center">
                <div className="h-4 w-32 bg-neutral-200 animate-pulse mx-auto" />
                <div className="h-20 w-full bg-neutral-200 animate-pulse" />
                <div className="h-[1px] w-12 bg-neutral-200 mx-auto" />
                <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="h-6 w-6 bg-neutral-200 animate-pulse mx-auto rounded-full" />
                        <div className="h-6 w-32 bg-neutral-200 animate-pulse mx-auto" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-6 w-6 bg-neutral-200 animate-pulse mx-auto rounded-full" />
                        <div className="h-6 w-32 bg-neutral-200 animate-pulse mx-auto" />
                    </div>
                </div>
                <div className="h-32 w-32 bg-neutral-200 animate-pulse mx-auto" />
            </div>
        </div>
    );
}
