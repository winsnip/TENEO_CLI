{
  "manifest_version": 2,
  "name": "Supabase Points Extension",
  "version": "1.0",
  "description": "Ekstensi untuk mengelola poin pengguna menggunakan Supabase",
  "permissions": [
    "storage",
    "https://ikknnrgxuxgjhplbpey.supabase.co/*",
    "wss://secure.ws.teneo.pro/*"
  ],
  "background": {
    "scripts": ["background.js"],
    "persistent": true
  }
}
