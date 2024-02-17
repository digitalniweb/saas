<template>
	<customForm :formHeader="formHeader">
		<v-row>
			<v-col cols="12">
				<v-text-field
					variant="underlined"
					id="city"
					label="Město"
					name="city"
					counter="64"
					prepend-inner-icon="mdi-city"
					v-model="formdata.city"
					dense
			/></v-col>
		</v-row>
	</customForm>
</template>
<script setup lang="ts">
	import { WebInformation } from "~/digitalniweb-types/models/content";
	import { formHeader } from "~/types/components/form";
	const formdata = ref<Partial<WebInformation>>({});
	const formHeader = ref<formHeader>({
		image: "https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
	});
</script>
