# IMAGE_IMPORT_DESCRIPTOR
	.section	.idata$2
	.global	_head_C__Users_neory_6no4pg4_OneDrive_Desktop_AEGIS_src_tauri_target_release_deps_rustcZF73qI_kernel32_dll_imports_lib
_head_C__Users_neory_6no4pg4_OneDrive_Desktop_AEGIS_src_tauri_target_release_deps_rustcZF73qI_kernel32_dll_imports_lib:
	.rva	hname	#Ptr to image import by name list
	#this should be the timestamp, but NT sometimes
	#doesn't load DLLs when this is set.
	.long	0	# loaded time
	.long	0	# Forwarder chain
	.rva	__C__Users_neory_6no4pg4_OneDrive_Desktop_AEGIS_src_tauri_target_release_deps_rustcZF73qI_kernel32_dll_imports_lib_iname	# imported dll's name
	.rva	fthunk	# pointer to firstthunk
#Stuff for compatibility
	.section	.idata$5
fthunk:
	.section	.idata$4
hname:
