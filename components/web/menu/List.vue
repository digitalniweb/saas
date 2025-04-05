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
			<WebMenuList v-if="item.children" :levelitems="item.children" />
		</li>
	</ul>
</template>

<script setup lang="ts">
	import type { InferAttributes } from "sequelize";
	import { buildTreeType } from "../../../digitalniweb-custom/helpers/buildTree";
	import { Article } from "../../../digitalniweb-types/models/content";

	const props = defineProps<{
		ulclass?: string;
		ulid?: string;
		levelitems: buildTreeType<InferAttributes<Article>>;
		buttonsProps?: object;
	}>();
</script>
