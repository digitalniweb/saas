<template>
	<ul :class="ulclass" :id="ulid">
		<li v-for="item in levelitems" :key="item.id">
			<v-btn :to="item.url" variant="plain">
				<v-icon v-if="item.icon" class="mr-2">
					mdi-{{ item.icon }}
				</v-icon>
				{{ item.name }}
				<v-icon v-if="item.children" class="ml-2">
					mdi-chevron-down
				</v-icon>
			</v-btn>
			<WebMenuList :levelitems="item.children" />
		</li>
	</ul>
</template>

<script setup>
	const props = defineProps({
		ulclass: String,
		ulid: String,
		levelitems: Array,
		buttonsProps: Object,
	});
</script>
