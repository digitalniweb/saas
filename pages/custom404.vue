<template></template>
<script setup>
	throw createError({
		statusCode: "404",
		statusMessage: "customMessage",
		fatal: true,
	});
</script>
