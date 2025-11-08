<template>
	<v-card elevation="10" color="border-md mb-5">
		<v-card-title
			class="text-overline bg-grey-darken-3"
			@click="props.closable && toggle()"
			:class="props.closable && 'cursor-pointer'"
		>
			{{ props.title }}
			<v-icon
				v-if="closable"
				:icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
				size="small"
			/>
		</v-card-title>
		<v-expand-transition>
			<div v-show="!props.closable || isOpen">
				<v-card-text class="pt-4">
					<slot></slot>
				</v-card-text>
			</div>
		</v-expand-transition>
	</v-card>
</template>

<script setup lang="ts">
	const props = withDefaults(
		defineProps<{
			closable?: boolean;
			opened?: boolean;
			title: string;
		}>(),
		{
			closable: true,
			opened: true,
		}
	);

	const isOpen = ref(props.opened);

	const toggle = () => {
		isOpen.value = !isOpen.value;
	};
</script>
