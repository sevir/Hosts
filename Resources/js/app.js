/*
 * SeViR for Digio Soluciones Digitales @2011
 * Hosts editor
 */

var hosts = function(){
	 var internal = {
		hostsFile: "",
		hostsPath: "",
		hostsContent: ""


	 }

	 var external = {
	 	saveHosts: function(){
			txtAreaVal = $("#txtFile").val();
			if (internal.hostsContent !== txtAreaVal){
				this.checkPerms(internal.hostsFile);

				internal.hostsFile = Titanium.Filesystem.getFileStream(internal.hostsFile);

				if (internal.hostsFile.open(Titanium.Filesystem.MODE_WRITE)){
					if (! internal.hostsFile.write(txtAreaVal) ){
						this.alert("Error saving hosts file");
					}
				}else{
					this.alert("Error opening hosts file for writing");
				}
			}
			internal.hostsFile.close();
			this.resetPerms();
	 	},

		checkPerms: function(file){
			if (Titanium.Platform.getName().indexOf("Darwin") >= 0){
				if(! file.isWritable()){
					var process = Titanium.Process.createProcess(["/usr/bin/osascript", Titanium.API.Application.getResourcesPath()+"/setpermissions.osx"]);

			        process();
				}
			}else{
				if(! file.isWritable()){
					this.alert("Please set hosts file as writable");
				}
			}
		},

		resetPerms: function(){
			if (Titanium.Platform.getName().indexOf("Darwin") >= 0){
				var process = Titanium.Process.createProcess(["/usr/bin/osascript", Titanium.API.Application.getResourcesPath()+"/unsetpermissions.osx"]);

			    process();
			}
		},

		exit: function(){
			this.saveHosts();
			Titanium.App.exit();
		},
		alert: function(m,t){
				if (typeof t == "undefined"){
					t = "Hosts file editor";
				}

				var w = $( "#dialog-message" ).data("kendoWindow");
				if(!w){
					var w = $( "#dialog-message" ).kendoWindow({
						 title: t,
					     visible: false,
					     modal: true
					}).data("kendoWindow");
				}


				$("#dialog-message .content").html(" "+m+" ");

				w.title(t);
				w.center();
				w.open();

				$("#dialog-message .closeBt").click(function(){
					w = $( "#dialog-message" ).data("kendoWindow");
					w.close();
				});
		},
		setHostsPath: function(p){
			internal.hostsPath = p;
		},
		readHosts: function(){
			internal.hostsFile = Titanium.Filesystem.getFile(internal.hostsPath+"hosts");
			this.checkPerms(internal.hostsFile);
			internal.hostsContent = internal.hostsFile.read();

			return internal.hostsContent;
		}
	 }

	 return external;
}();

$(function(){
	if (Titanium.Platform.getName().indexOf("Windows") >= 0){
		hosts.setHostsPath("C:\\Windows\\System32\\drivers\\etc\\");
	}else{
		hosts.setHostsPath("/etc/");
	}

	$("#txtFile").val(
		hosts.readHosts()
	);

	$(document).keyup(function(e){
		code = (e.keyCode ? e.keyCode : e.which);
		if (code == 27){
			hosts.exit();
		}
	});

	$("#txtFile").tabby();

	var w = $( "#dialog-message" ).kendoWindow({
			 title: "Hosts editor",
		     visible: false,
		     modal: true
		}).data("kendoWindow");

	$("#menu").kendoMenu();
});