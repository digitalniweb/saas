export function useDebounce() {
	const debounceTimeout = ref<ReturnType<typeof setTimeout> | null>(null);
	const debounce = <T extends (...args: any[]) => void>(
		fn: T,
		delay: number
	) => {
		return (...args: Parameters<T>) => {
			if (debounceTimeout.value) {
				clearTimeout(debounceTimeout.value);
			}

			debounceTimeout.value = setTimeout(() => {
				fn(...args);
			}, delay);
		};
	};
	return { debounce };
}
