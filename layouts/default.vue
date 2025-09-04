<template>
	<v-app>
		<WebBlocksMenu />
		<v-main>
			<slot />
		</v-main>
		<WebBlocksFooter />
	</v-app>
</template>
<script setup>
	// import { useWebInformationStore } from "@/store/webInformation";
	// import { storeToRefs } from "pinia";
	// const { all, en } = storeToRefs(useWebInformationStore());
	import { useRouter } from "vue-router";
	const router = useRouter();
	onMounted(() => {
		// make links from db clickable
		window.addEventListener("click", (event) => {
			let { target } = event;
			while (target && target.tagName !== "A") target = target.parentNode;
			if (
				target &&
				target.matches("a:not([href*='://'])") &&
				target.href
			) {
				// some sanity checks taken from vue-router:
				// https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
				const {
					altKey,
					ctrlKey,
					metaKey,
					shiftKey,
					button,
					defaultPrevented,
				} = event;
				// don't handle with control keys
				if (metaKey || altKey || ctrlKey || shiftKey) return;
				// don't handle when preventDefault called
				if (defaultPrevented) return;
				// don't handle right clicks
				if (button !== undefined && button !== 0) return;
				// don't handle if `target="_blank"`
				if (target && target.getAttribute) {
					const linkTarget = target.getAttribute("target");
					if (/\b_blank\b/i.test(linkTarget)) return;
				}
				// don't handle same page links/anchors
				const url = new URL(target.href);
				const to = url.pathname;
				if (
					!["mailto:", "tel:"].includes(url.protocol) &&
					window.location.pathname !== to &&
					event.preventDefault
				) {
					event.preventDefault();
					return router.push(to);
				}
			}
		});
	});
</script>
