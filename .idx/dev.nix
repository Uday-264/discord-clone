{pkgs}: {
  channel = "stable-23.11";
  services.docker.enable = true;
  packages = [
    pkgs.nodejs_20
    pkgs.docker
    pkgs.openssl
    

  ];
  idx.extensions = [
    
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}