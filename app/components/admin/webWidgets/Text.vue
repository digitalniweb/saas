<template>
	<div v-if="widgetContent">
		<v-row>
			<v-col>
				<v-card>
					<v-card-text>
						<v-row>
							<v-col lg="8" cols="12">
								<v-text-field
									variant="underlined"
									:label="translate('Name2')"
									counter="64"
									prepend-inner-icon="mdi-alpha-n"
									v-model="widgetContent.name"
									validate-on="blur"
									:rules="[
										() =>
											!!widgetContent.name ||
											translate('Fill in this field'),
									]"
								/>
							</v-col>
							<v-col lg="4" cols="12" class="d-flex">
								<v-tooltip
									:text="translate('show')"
									location="bottom"
									v-if="
										widgetContent.options?.showHeading !==
										undefined
									"
								>
									<template v-slot:activator="{ props }">
										<v-switch
											v-bind="props"
											density="compact"
											hide-details
											v-model="
												widgetContent.options
													.showHeading
											"
											width="50px"
											color="success"
										/>
									</template>
								</v-tooltip>
								<v-select
									:items="headingTypes"
									:disabled="
										!widgetContent.options?.showHeading
									"
									v-model="headingType"
									:label="translate('Show as')"
									width="135px"
									density="compact"
									hide-details
									variant="solo"
									class="elevation-0 ml-5 align-center"
								></v-select>
							</v-col>
							<CustomTextEditor v-model="widgetContent.content" />
						</v-row>
					</v-card-text>
				</v-card>
			</v-col>
			<v-col>
				<v-card>
					<!-- <v-card-title>{{ translate("appearance") }}</v-card-title> -->
					<v-card-text>
						<v-tabs v-model="tab">
							<v-tab
								prepend-icon="mdi-information-slab-circle-outline"
								text="info"
								value="options-info"
							></v-tab>
							<v-tab
								prepend-icon="mdi-rectangle-outline"
								:text="translate('container')"
								value="options-container"
							></v-tab>
							<v-tab
								prepend-icon="mdi-text-box"
								:text="translate('content')"
								value="options-content"
							></v-tab>
						</v-tabs>

						<v-tabs-window v-model="tab" class="w-100">
							<v-tabs-window-item value="options-info">
								<v-card flat>
									<v-card-text>
										<CustomInfoContentLayout />
									</v-card-text>
								</v-card>
							</v-tabs-window-item>

							<v-tabs-window-item value="options-container">
								<v-card flat>
									<v-card-text>
										<CustomPickersCustomClass
											v-if="
												widgetContent.options?.container
													?.class !== undefined
											"
											v-model="
												widgetContent.options.container
													.class
											"
										/>
										<CustomPickersContainerWidth
											v-if="
												widgetContent.options?.container
													?.width
											"
											v-model="
												widgetContent.options.container
													.width
											"
										/>
										<CustomPickersPadding
											v-if="
												widgetContent.options?.container
													?.padding
											"
											v-model="
												widgetContent.options.container
													.padding
											"
										/>
										<v-card elevation="10" class="mt-7">
											<v-card-title class="text-overline">
												{{ translate("Background") }}
											</v-card-title>
											<v-card-text>
												<CustomPickersBackgroundOverlay
													v-if="
														widgetContent?.options
															?.container
															?.background
															?.overlay !==
														undefined
													"
													v-model="
														widgetContent.options
															.container
															.background.overlay
													"
												/>
												<CustomPickersBackgroundColor
													v-if="
														widgetContent?.options
															?.container
															?.background
															?.color !==
														undefined
													"
													v-model="
														widgetContent.options
															.container
															.background.color
													"
												/>
												<CustomPickersBackgroundImage
													v-if="
														widgetContent?.options
															?.container
															?.background
															?.image !==
														undefined
													"
													v-model="
														widgetContent.options
															.container
															.background.image
													"
												/>
											</v-card-text>
										</v-card>
									</v-card-text>
								</v-card>
							</v-tabs-window-item>

							<v-tabs-window-item value="options-content">
								<v-card flat>
									<v-card-text>
										<p>
											Fusce a quam. Phasellus nec sem in
											justo pellentesque facilisis. Nam
											eget dui. Proin viverra, ligula sit
											amet ultrices semper, ligula arcu
											tristique sapien, a accumsan nisi
											mauris ac eros. In dui magna,
											posuere eget, vestibulum et, tempor
											auctor, justo.
										</p>

										<p class="mb-0">
											Cras sagittis. Phasellus nec sem in
											justo pellentesque facilisis. Proin
											sapien ipsum, porta a, auctor quis,
											euismod ut, mi. Donec quam felis,
											ultricies nec, pellentesque eu,
											pretium quis, sem. Nam at tortor in
											tellus interdum sagittis.
										</p>
									</v-card-text>
								</v-card>
							</v-tabs-window-item>
						</v-tabs-window>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>

		<v-card class="mt-10">
			<v-toolbar density="compact" flat>
				<v-toolbar-title class="white--text">
					{{ translate("Preview") }}
				</v-toolbar-title>
			</v-toolbar>
			<v-card-text class="pa-0">
				<div v-html="widgetContent.content"></div>
			</v-card-text>
		</v-card>
	</div>
</template>

<script setup lang="ts">
	const { translate } = useTranslations();
	import type { CreationAttributes, InferAttributes } from "sequelize";
	import { widgetTextOptionsDefault } from "~~/digitalniweb-custom/variables/widgets";
	import type { WidgetText } from "~~/digitalniweb-types/models/content";
	const headingTypes = [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6",
		"p.subtitle",
		"p.caption",
		"p.overline",
	] as const;

	const tab = ref("option-1");

	const headingType = ref<(typeof headingTypes)[number]>("h2");

	const props = defineProps<{
		moduleId: number;
	}>();
	const widgetContent = defineModel<
		InferAttributes<WidgetText> | CreationAttributes<WidgetText>
	>({
		default: {
			// name: "",
			// content: "",
			// moduleId: 0,
			// options: {
			// 	background: {
			// 		color: "",
			// 	},
			// 	container: {
			// 		width: "container-fluid",
			// 	},
			// } as widgetTextOptions,
		},
	});
	if (props.moduleId) widgetContent.value.moduleId = props.moduleId;

	// nested objects must be filled in as default like so
	if (!widgetContent?.value.options)
		widgetContent.value.options = structuredClone(widgetTextOptionsDefault);
</script>
