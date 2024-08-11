<template>
	<template v-for="item in levelitems" :key="item.id">
		<v-list-item
			v-if="!item.children"
			:to="'/admin/' + getLanguageItemProperty(item, 'url')"
			:prepend-icon="item.icon"
			:title="getLanguageItemProperty(item, 'name') as string"
		>
		</v-list-item>
		<v-list-group v-else :value="item.id">
			<template v-slot:activator="{ props }">
				<v-list-item
					v-bind="props"
					:prepend-icon="item.icon"
					:title="getLanguageItemProperty(item, 'name') as string"
				></v-list-item>
			</template>
			<AdminMenuList
				v-if="item.children"
				:levelitems="item.children"
				:languageId="languageId"
			/>
		</v-list-group>
	</template>
</template>

<script setup lang="ts">
	import { InferAttributes } from "sequelize";
	import {
		buildTreeType,
		TreeNode,
	} from "../../../digitalniweb-custom/helpers/buildTree";
	import {
		AdminMenu,
		AdminMenuLanguage,
	} from "../../../digitalniweb-types/models/globalData";

	const props = defineProps<{
		levelitems: buildTreeType<InferAttributes<AdminMenu>>;
		languageId: number;
	}>();

	const getLanguageItemProperty = (
		item: TreeNode<InferAttributes<AdminMenu>>,
		property: keyof AdminMenuLanguage
	) => {
		let currentLanguageItem = item.AdminMenuLanguages?.find(
			(e) => e.LanguageId == props.languageId
		);
		return currentLanguageItem?.[property] ?? "";
	};
</script>
