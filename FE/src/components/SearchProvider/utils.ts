export function debouncePromise<T extends (...args: any[]) => Promise<any>>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let rejectLatest: ((reason?: any) => void) | null = null;

    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
        if (timer) clearTimeout(timer);
        if (rejectLatest) {
            rejectLatest({ isCanceled: true });
        }

        return new Promise((resolve, reject) => {
            rejectLatest = reject;

            timer = setTimeout(async () => {
                try {
                    const result = await fn(...(args as any));
                    resolve(result);
                } catch (err) {
                    reject(err);
                }
            }, delay);
        });
    };
}
