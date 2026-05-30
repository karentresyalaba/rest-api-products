const express = require("express");
const app = express();
const PORT = 3000;


app.use(express.json());


let products = [
  { id: 1, name: "Nasi Goreng", price: 15000, stock: 50, category: "Makanan" },
  { id: 2, name: "Es Teh Manis", price: 5000, stock: 100, category: "Minuman" },
  { id: 3, name: "Bakso", price: 3500, stock: 200, category: "Makanan" },
  { id: 4, name: "Mie Ayam", price: 12000, stock: 40, category: "Makanan" },
  { id: 5, name: "Jus Alpukat", price: 18000, stock: 30, category: "Minuman" },
];
let nextId = 6; 

const findProductById = (id) => products.find((p) => p.id === parseInt(id));


app.get("/api/products", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Berhasil mengambil semua produk",
    total: products.length,
    data: products,
  });
});



app.post("/api/products", (req, res) => {
  const { name, price, stock, category } = req.body;

  
  if (!name || price === undefined || stock === undefined || !category) {
    return res.status(400).json({
      success: false,
      message: "Semua field wajib diisi: name, price, stock, category",
    });
  }

 
  if (typeof price !== "number" || typeof stock !== "number") {
    return res.status(400).json({
      success: false,
      message: "Field 'price' dan 'stock' harus berupa angka",
    });
  }

  
  const newProduct = {
    id: nextId++, 
    name,
    price,
    stock,
    category,
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: "Produk berhasil ditambahkan",
    data: newProduct,
  });
});



app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { price, stock } = req.body;

  
  const product = findProductById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Produk dengan ID ${id} tidak ditemukan`,
    });
  }

  
  if (price === undefined && stock === undefined) {
    return res.status(400).json({
      success: false,
      message: "Minimal satu field harus diisi: price atau stock",
    });
  }

  
  if (price !== undefined && typeof price !== "number") {
    return res.status(400).json({
      success: false,
      message: "Field 'price' harus berupa angka",
    });
  }
  if (stock !== undefined && typeof stock !== "number") {
    return res.status(400).json({
      success: false,
      message: "Field 'stock' harus berupa angka",
    });
  }

  
  if (price !== undefined) product.price = price;
  if (stock !== undefined) product.stock = stock;

  res.status(200).json({
    success: true,
    message: `Produk dengan ID ${id} berhasil diupdate`,
    data: product,
  });
});


 
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

 
  const index = products.findIndex((p) => p.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Produk dengan ID ${id} tidak ditemukan`,
    });
  }

 
  const deletedProduct = products.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: `Produk dengan ID ${id} berhasil dihapus`,
    data: deletedProduct,
  });
});


app.listen(PORT, () => {
  console.log(` Server berjalan di http://localhost:${PORT}`);
  console.log(` REST API Products siap digunakan!\n`);
  console.log("Daftar Endpoint:");
  console.log(`  GET    http://localhost:${PORT}/api/products`);
  console.log(`  POST   http://localhost:${PORT}/api/products`);
  console.log(`  PUT    http://localhost:${PORT}/api/products/:id`);
  console.log(`  DELETE http://localhost:${PORT}/api/products/:id`);
});