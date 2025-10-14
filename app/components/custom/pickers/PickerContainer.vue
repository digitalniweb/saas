<template>
	<v-row>
		<v-col lg="3" cols="12" class="align-content-center">
			<slot name="name"></slot>
		</v-col>
		<v-col :lg="hasOther ? 7 : 9" cols="12">
			<slot name="values"></slot>
		</v-col>
		<v-col v-if="$slots.other" lg="2" cols="12">
			<slot name="other"></slot>
		</v-col>
	</v-row>
</template>
<script setup lang="ts">
	const slots = useSlots();

	const hasOther = !!slots.other;
</script>
