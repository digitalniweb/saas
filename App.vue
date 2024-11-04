<template>
	<NuxtLoadingIndicator :throttle="200" />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<CustomConfirm />
	<CustomSnackBars />
	<CustomFileManager />
</template>
