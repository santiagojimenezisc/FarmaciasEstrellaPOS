<template>
  <q-page padding>
    <h5>Price Comparator</h5>

    <!-- Upload Excel -->
    <q-file
      filled
      v-model="file"
      label="Subir documento de precios"
      accept=".xlsx, .xls"
      @update:model-value="handleFile"
    />

    <!-- Status -->
    <div v-if="products.length" class="q-mt-md">
      <h6>Productos cargados: {{ products.length }}</h6>
    </div>

    <!-- Search Input -->
    <q-input
      filled
      v-model="searchCode"
      label="Buscar por código"
      class="q-mt-md"
      @keyup.enter="searchProduct"
    >
      <template v-slot:append>
        <q-icon name="qr_code_scanner" class="cursor-pointer" @click="startScanner" />
      </template>
    </q-input>

    <!-- Search Button -->
    <q-btn label="Buscar" color="primary" class="q-mt-sm" @click="searchProduct" />

    <!-- Scanner container -->
    <div
      v-show="isScanning"
      id="reader"
      style="width: 100%; max-width: 400px"
      class="q-mt-md"
    ></div>

    <!-- Result -->
    <div v-if="foundProduct" class="q-mt-lg q-pa-md bg-green-1 rounded-borders">
      <div class="text-h6">
        {{ foundProduct.name }}
      </div>
      <div>Código: {{ foundProduct.barcode }}</div>
      <div class="text-h5 text-primary">${{ foundProduct.price }}</div>
    </div>

    <!-- Not found -->
    <div v-else-if="notFound" class="q-mt-lg text-red">Producto no encontrado</div>

    <!-- Empty -->
    <div v-else-if="!products.length" class="q-mt-lg text-grey">No products loaded</div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { Html5Qrcode } from 'html5-qrcode'

/* =========================
   TYPES
========================= */
interface Product {
  barcode: string
  name: string
  price: number
}

/* =========================
   STATE
========================= */
const file = ref<File | null>(null)
const products = ref<Product[]>([])

// Search
const searchCode = ref('')
const foundProduct = ref<Product | null>(null)
const notFound = ref(false)

// Scanner
let scanner: Html5Qrcode | null = null
const isScanning = ref(false)

// Fast lookup
const productMap = new Map<string, Product>()

/* =========================
   METHODS
========================= */

// Build map for fast search
const buildMap = (list: Product[]) => {
  productMap.clear()
  list.forEach((p) => {
    productMap.set(p.barcode, p)
  })
}

// Read Excel
const handleFile = (uploadedFile: File | null) => {
  if (!uploadedFile) return

  const reader = new FileReader()

  reader.onload = (event: ProgressEvent<FileReader>) => {
    const result = event.target?.result
    if (!result) return

    const data = new Uint8Array(result as ArrayBuffer)

    const workbook = XLSX.read(data, { type: 'array' })

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]

    let json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

    // Map Excel -> Product
    const cleanData: Product[] = json
      .filter((item) => item.Clave && item.Descripcion && item.PrecioDescuento)
      .map((item) => ({
        barcode: String(item.Clave).trim(),
        name: String(item.Descripcion).trim(),
        price: Number(item.PrecioDescuento),
      }))

    products.value = cleanData

    // Build map
    buildMap(products.value)

    console.log('Loaded products:', products.value)
  }

  reader.readAsArrayBuffer(uploadedFile)
}

// Search product
const searchProduct = () => {
  if (!searchCode.value) return

  const code = searchCode.value.trim()
  const product = productMap.get(code)

  if (product) {
    foundProduct.value = product
    notFound.value = false
  } else {
    foundProduct.value = null
    notFound.value = true
  }

  // Clear input (good for scanner UX)
  searchCode.value = ''
}

/* =========================
   SCANNER
========================= */

const startScanner = async () => {
  if (isScanning.value) return

  isScanning.value = true

  scanner = new Html5Qrcode('reader')

  try {
    await scanner.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: 250,
      },
      (decodedText: string) => {
        console.log('Scanned:', decodedText)

        searchCode.value = decodedText
        searchProduct()

        stopScanner()
      },
      () => {
        // ignore scan errors
      },
    )
  } catch (err) {
    console.error('Camera error:', err)
    isScanning.value = false
  }
}

const stopScanner = async () => {
  if (scanner) {
    await scanner.stop()
    await scanner.clear()
    scanner = null
  }

  isScanning.value = false
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
