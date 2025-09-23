<!-- 
Works in conjunction with <CustomConfirm>
Use as follows anywhere:
    - In template:
    <CustomConfirmTeleport :teleportId="teleportId">
        your content
    </CustomConfirmTeleport>

    - In script:
    import { useConfirmStore } from "~/store/confirm";
	const confirmStore = useConfirmStore();
    const teleportId = ref("someRelevantIdName"); // change this every time
    const btnClick = async () => {
		let response = await confirmStore.open(
			"Title",
			"",
			{},
			teleportId.value
		);
	};
-->
<template>
	<teleport
		:to="'#' + props.teleportId"
		v-if="props.teleportId === confirmStore.teleportId"
	>
		<slot></slot>
	</teleport>
</template>
<script setup lang="ts">
	import { useConfirmStore } from "~/store/confirm";
	const confirmStore = useConfirmStore();

	const props = defineProps({
		teleportId: {
			type: String,
			required: true,
		},
	});
</script>
