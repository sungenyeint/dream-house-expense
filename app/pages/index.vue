<template>
  <div class="min-h-screen bg-slate-100 p-4 pb-24">
    <div class="max-w-md mx-auto space-y-6">

      <!-- Header -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h1 class="text-xl font-semibold text-slate-800">
          🏠 အိမ်ဆောက် ကုန်ကျစရိတ်
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          အလုပ်သမား · ပစ္စည်း · အစားသောက် စာရင်း
        </p>
      </div>

      <!-- Summary -->
      <div class="space-y-3">

        <!-- Budget -->
        <SummaryCard class="bg-white border border-slate-200 border-l-4 border-l-indigo-400" title="🎯 ဘတ်ဂျက်"
          :value="budget">
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 space-y-2 border-t pt-2">
              <div v-if="!isEditingBudget" class="flex items-center justify-between">
                <div>လက်ကျန် = <span class="font-medium">{{ currentAmount.toLocaleString() }} ကျပ်</span></div>
                <button @click="startEditBudget"
                  class="inline-flex items-center gap-1 text-sm text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md">
                  <span class="text-xs">✏️</span>
                  <span>edit</span>
                </button>
              </div>

              <div v-else class="space-y-2">
                <input type="number" v-model="tempBudget" class="w-full rounded-xl border border-slate-300 p-2" />
                <div class="flex gap-2">
                  <button @click="saveBudget" class="flex-1 bg-indigo-500 text-white rounded-xl py-2">
                    သိမ်းမယ်
                  </button>
                  <button @click="cancelEditBudget" class="flex-1 border border-slate-300 rounded-xl py-2">
                    မပြင်တော့
                  </button>
                </div>
              </div>
            </div>
          </template>
        </SummaryCard>

        <!-- Grand Total -->
        <SummaryCard class="bg-white border border-slate-200 border-l-4 border-l-blue-400"
          title="💰 စုစုပေါင်းကုန်ကျငွေ" :value="grandTotal">
          <template #extra>
            <div class="mt-2 text-xs text-slate-600  border-t pt-2">
              <p>✅ ရှင်းပြီး = {{ completedTotal.toLocaleString() }} ကျပ်</p>
              <p class="pt-2">⏳ မရှင်းရသေး = {{ pendingTotal.toLocaleString() }} ကျပ်</p>
            </div>
          </template>
        </SummaryCard>

        <!-- Labor -->
        <SummaryCard class="bg-white border border-slate-200 border-l-4 border-l-slate-500" title="👷 အလုပ်သမားခ"
          :value="laborTotal">
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 border-t pt-2">
              လူဦးရေစုစုပေါင်း = {{ laborCountTotal }} ဦး
            </div>
          </template>
        </SummaryCard>

        <!-- Material -->
        <SummaryCard class="bg-white border border-slate-200 border-l-4 border-l-slate-600" title="🧱 ပစ္စည်းဝယ်"
          :value="materialTotal">
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 space-y-1 border-t">
              <div v-for="(m, i) in materialCategorySummary" :key="i" class="flex justify-between pt-2">
                <span>{{ i + 1 }}. {{ m.category }}</span>
                <span class="font-medium">{{ m.details }} ကျပ်</span>
              </div>
            </div>
          </template>
        </SummaryCard>

        <!-- Food -->
        <SummaryCard class="bg-white border border-slate-200 border-l-4 border-l-slate-400" title="🍽️ အစားသောက်"
          :value="foodTotal" />
      </div>

      <!-- Progress Gallery -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mt-6">
        <h2 class="font-semibold text-slate-700 mb-3 text-center">
          🏠 လုပ်ငန်းတိုးတက်မှု မှတ်တမ်း
        </h2>

        <p class="text-xs text-slate-400 text-center mb-3">
          ⇆ နေ့အလိုက် ဆွဲကြည့်နိုင်ပါတယ်
        </p>

        <div v-if="!groupedImages.length" class="text-xs text-slate-400 text-center">
          ပုံမရှိသေးပါ
        </div>

        <!-- Slider -->
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex gap-4 snap-x snap-mandatory px-1">

            <!-- Day Card -->
            <div v-for="group in groupedImages" :key="group.label" class="snap-start shrink-0 w-[92%] sm:w-[420px]">
              <div class="bg-slate-50 rounded-xl border border-slate-200
                 shadow-sm hover:shadow-md transition p-4">
                <!-- Header -->
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-semibold text-slate-700">
                    📅 {{ group.label }}
                  </h3>

                  <span class="text-xs px-2 py-0.5 rounded-full
                     bg-indigo-50 text-indigo-600 font-medium">
                    {{ group.images.length }} ပုံ
                  </span>
                </div>

                <!-- Images Grid -->
                <div class="grid grid-cols-3 gap-2">
                  <div v-for="(img, i) in group.images.slice(0, 6)" :key="img.id" class="relative rounded-lg overflow-hidden
                     border border-slate-200
                     active:scale-95 transition" @click="openViewer(img, group.images)">
                    <img :src="img.url" class="h-28 w-full object-cover
                       transition-transform duration-300
                       hover:scale-105" />

                    <!-- + More Overlay -->
                    <div v-if="i === 5 && group.images.length > 6" class="absolute inset-0 bg-black/60
                       text-white flex items-center justify-center
                       text-lg font-semibold">
                      +{{ group.images.length - 6 }}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Upload Images -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 class="font-semibold mb-4">➕ ပုံတင်မည်</h2>

        <input ref="fileInput" type="file" multiple accept="image/*" class="w-full text-sm" @change="onFileChange" />

        <button @click="saveHouseImages" :disabled="uploading || !selectedFiles.length"
          class="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 font-medium mt-4 disabled:opacity-50">
          🏠 သိမ်းမယ်
        </button>
      </div>

      <div v-if="uploading" class="text-xs text-slate-500">
        ⏳ ပုံတင်နေသည်...
      </div>

      <!-- Add Form -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <button @click="isFormOpen = !isFormOpen"
          class="w-full flex justify-between items-center font-semibold text-slate-700">
          <span>➕ စာရင်းထည့်ရန်</span>
          <span :class="isFormOpen ? 'rotate-180' : ''">▼</span>
        </button>

        <form ref="formEl" v-show="isFormOpen" @submit.prevent="addExpense" class="space-y-3 mt-4">
          <FormInput label="နေ့" type="date" v-model="form.date" />

          <select v-model="form.type" class="w-full rounded-xl border border-slate-300 p-2">
            <option value="labor">👷 အလုပ်သမားခ</option>
            <option value="material">🧱 ပစ္စည်းဝယ်</option>
            <option value="food">🍽️ အစားသောက်</option>
          </select>

          <FormInput v-if="form.type === 'labor'" label="လူဦးရေ" type="number" v-model="form.count" />

          <FormInput v-if="form.type === 'material'" label="ပစ္စည်းအမျိုးအစား" v-model="form.category" />

          <FormInput v-if="form.type === 'material'" label="အရေအတွက်" type="number" v-model="form.qty" />

          <FormInput label="ငွေပမာဏ (ကျပ်)" type="number" v-model="form.amount" />

          <FormInput label="မှတ်ချက်" v-model="form.note" />

          <div class="text-sm text-slate-700">
            <label class="block mb-1">အခြေအနေ</label>
            <div class="flex gap-4 items-center">
              <label class="flex items-center gap-2">
                <input type="radio" v-model="form.status" value="completed" />
                <span>ရှင်းပြီး</span>
              </label>
              <label class="flex items-center gap-2">
                <input type="radio" v-model="form.status" value="pending" />
                <span>မရှင်းရသေး</span>
              </label>
            </div>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2 font-medium">
              သိမ်းမယ်
            </button>
            <button v-if="editingId" type="button" @click="cancelEdit"
              class="flex-1 border border-slate-300 rounded-xl py-2 font-medium">
              မပြင်တော့
            </button>
          </div>
        </form>
      </div>

      <!-- Pending Expenses -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 class="font-semibold mb-3 text-slate-700 border-b pb-2">⏳ မရှင်းရသေး — Pending
          <span class="text-sm text-slate-500">{{ pendingTotal.toLocaleString() }} ကျပ်</span>
        </h2>

        <div class="flex gap-2 mt-3 mb-4">
          <button @click="pendingFilter = 'all'" :class="pendingFilter === 'all' ? activeBtn : inactiveBtn">
            All
          </button>

          <button @click="pendingFilter = 'labor'" :class="pendingFilter === 'labor' ? activeBtn : inactiveBtn">
            👷 အလုပ်သမားခ
          </button>

          <button @click="pendingFilter = 'material'" :class="pendingFilter === 'material' ? activeBtn : inactiveBtn">
            🧱 ပစ္စည်းဝယ်
          </button>
        </div>

        <div v-if="filteredPendingExpenses.length === 0" class="text-xs text-slate-400">
          စာရင်းမရှိသေးပါ
        </div>

        <div v-for="e in filteredPendingExpenses" :key="e.id"
          class="flex justify-between border-b border-slate-100 py-3 last:border-0">
          <div>
            <p class="text-xs text-slate-400">{{ e.date }}</p>
            <p class="font-medium text-slate-700">
              <span v-if="e.type === 'labor'">👷 ({{ e.count }} ဦး)</span>
              <span v-else-if="e.type === 'material'">🧱 {{ e.category }} × {{ e.qty }}</span>
              <span v-else>🍽️ အစားသောက်</span>
            </p>
            <p class="text-xs text-slate-500 mt-1">{{ e.status }}</p>
          </div>
          <div class="flex flex-col items-end">
            <p class="font-semibold text-slate-800">{{ e.amount.toLocaleString() }} ကျပ်</p>
            <button @click="editExpense(e)"
              class="text-xs text-indigo-600 mt-1 inline-flex items-center gap-1 px-2 py-1 border border-indigo-100 rounded-md hover:bg-indigo-50">
              <span class="text-xs">✏️</span>
              <span>edit</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Completed Expenses -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 class="font-semibold mb-3 text-slate-700 border-b pb-2">✅ ရှင်းပြီး — Completed
          <span class="text-sm text-slate-500">{{ completedTotal.toLocaleString() }} ကျပ်</span>
        </h2>

        <div v-if="completedExpenses.length === 0" class="text-xs text-slate-400">စာရင်းမရှိသေးပါ</div>
        <div v-for="(e, i) in completedExpenses" :key="e.id"
          class="flex justify-between border-b border-slate-100 py-3 last:border-0">
          <div>
            <p class="text-xs text-slate-400">{{ e.date }}</p>
            <p class="font-medium text-slate-700">
              <span v-if="e.type === 'labor'">👷 ({{ e.count }} ဦး)</span>
              <span v-else-if="e.type === 'material'">🧱 {{ e.category }} × {{ e.qty }}</span>
              <span v-else>🍽️ အစားသောက်</span>
            </p>
            <p class="text-xs text-slate-500 mt-1">{{ e.status }}</p>
          </div>
          <div class="flex flex-col items-end">
            <p class="font-semibold text-slate-800">{{ e.amount.toLocaleString() }} ကျပ်</p>
            <button @click="editExpense(e)"
              class="text-xs text-indigo-600 mt-1 inline-flex items-center gap-1 px-2 py-1 border border-indigo-100 rounded-md hover:bg-indigo-50">
              <span class="text-xs">✏️</span>
              <span>edit</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Bottom Nav -->
  <div class="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around p-2">
    <NuxtLink to="/" class="flex flex-col items-center text-xs text-slate-600">
      🏠 <span>Home</span>
    </NuxtLink>
    <NuxtLink to="/report" class="flex flex-col items-center text-xs text-slate-600">
      📊 <span>Report</span>
    </NuxtLink>
  </div>

  <!-- Image Viewer -->
  <div v-if="showViewer" class="fixed inset-0 z-50 bg-black flex items-center justify-center" @touchstart="onTouchStart"
    @touchend="onTouchEnd">
    <!-- Top Toolbar -->
    <div class="absolute top-4 left-4 right-4 flex items-center justify-between
           bg-black/60 backdrop-blur-lg rounded-2xl px-4 py-2">
      <!-- Close -->
      <button @click="closeViewer" class="w-10 h-10 flex items-center justify-center
             rounded-full text-white text-xl
             hover:bg-white/10 transition">
        ✕
      </button>

      <!-- Actions -->
      <div class="flex gap-2">
        <!-- Download -->
        <button @click="downloadImage" class="flex items-center gap-1 px-3 py-1.5 rounded-xl
               text-sm font-medium text-emerald-300
               hover:bg-emerald-500/20 transition">
          📥 Save
        </button>

        <!-- Delete -->
        <button @click="confirmDelete = true" class="flex items-center gap-1 px-3 py-1.5 rounded-xl
               text-sm font-medium text-rose-400
               hover:bg-rose-500/20 transition">
          🗑️ Delete
        </button>
      </div>
    </div>

    <!-- Prev -->
    <button @click="prevImage" class="absolute left-2 md:left-6 text-white text-5xl
           opacity-70 hover:opacity-100 select-none transition">
      ‹
    </button>

    <!-- Image -->
    <img :src="activeImage.url" @dblclick="toggleZoom" :style="{ transform: `scale(${scale})` }" class="max-h-[85vh] max-w-[92vw]
           transition-transform duration-300
           rounded-2xl shadow-2xl" />

    <!-- Next -->
    <button @click="nextImage" class="absolute right-2 md:right-6 text-white text-5xl
           opacity-70 hover:opacity-100 select-none transition">
      ›
    </button>

    <!-- Delete Confirmation -->
    <div v-if="confirmDelete" class="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div class="bg-white rounded-2xl w-80 p-5 space-y-4 shadow-xl">
        <h3 class="font-semibold text-slate-800 text-center">
          Delete this image?
        </h3>

        <p class="text-sm text-slate-500 text-center">
          This action cannot be undone.
        </p>

        <div class="flex gap-3 pt-2">
          <button @click="confirmDelete = false" class="flex-1 py-2 rounded-xl border
                 text-slate-600 hover:bg-slate-100 transition">
            Cancel
          </button>

          <button @click="deleteImage" class="flex-1 py-2 rounded-xl
                 bg-rose-500 text-white
                 hover:bg-rose-600 transition">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>



</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const { $db } = useNuxtApp()  // <-- here

const expenses = ref([]);
const isFormOpen = ref(false);
const uploadImages = ref([])   // Cloudinary URLs (TEMP)
const houseImages = ref([])    // Firestore images (DB)

const uploading = ref(false)
const fileInput = ref(null)
const selectedFiles = ref([])

// Budget
const budget = ref(21300000);
const isEditingBudget = ref(false)
const tempBudget = ref('')

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  type: 'labor',
  // worker: '',
  count: 1,
  category: '',
  qty: 1,
  amount: '',
  note: '',
  status: 'completed',
})

const editingId = ref(null)
const formEl = ref(null)

const showViewer = ref(false)
const activeImage = ref(null)
const scale = ref(1)
const confirmDelete = ref(false)
const pendingFilter = ref('all') // all | labor | material

const activeBtn =
  'px-4 py-1 rounded-xl text-xs font-medium bg-indigo-500 text-white'

const inactiveBtn =
  'px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-100'


const filteredPendingExpenses = computed(() => {
  const pendingExpenses = expenses.value.filter(e => (e.status || 'completed') === 'pending')
  if (pendingFilter.value === 'all') return pendingExpenses

  return pendingExpenses.filter(
    e => e.type === pendingFilter.value
  )
})

const groupedImages = computed(() => {
  const groups = {}

  houseImages.value.forEach(img => {
    if (!img.createdAt) return
    const date = img.createdAt.toDate().toDateString()

    if (!groups[date]) groups[date] = []
    groups[date].push(img)
  })

  return Object.entries(groups).map(([date, imgs]) => ({
    label: date,
    images: imgs
  }))
})


// touch
let startX = 0

const openViewer = (img) => {
  activeImage.value = img
  scale.value = 1
  showViewer.value = true
}

const closeViewer = () => {
  showViewer.value = false
}

const nextImage = () => {
  const idx = houseImages.value.findIndex(i => i.id === activeImage.value.id)
  if (idx < houseImages.value.length - 1)
    activeImage.value = houseImages.value[idx + 1]
}

const prevImage = () => {
  const idx = houseImages.value.findIndex(i => i.id === activeImage.value.id)
  if (idx > 0)
    activeImage.value = houseImages.value[idx - 1]
}

const onTouchStart = (e) => {
  startX = e.touches[0].clientX
}

const onTouchEnd = (e) => {
  const endX = e.changedTouches[0].clientX
  const diff = startX - endX

  if (diff > 50) nextImage()
  if (diff < -50) prevImage()
}

const toggleZoom = () => {
  scale.value = scale.value === 1 ? 2 : 1
}

const downloadImage = () => {
  window.open(activeImage.value.url, '_blank')
}

const deleteImage = async () => {
  if (!activeImage.value) return
  // 🔥 Remove from Firestore
  await deleteDoc(doc($db, 'house_images', activeImage.value.id))

  // 🔥 Update UI
  houseImages.value = houseImages.value.filter(
    img => img.id !== activeImage.value.id
  )

  confirmDelete.value = false
  closeViewer()
}

const expensesCol = collection($db, 'expenses')

const onFileChange = (e) => {
  selectedFiles.value = Array.from(e.target.files)
}

const saveHouseImages = async () => {
  if (!selectedFiles.value.length) return

  uploading.value = true

  const urls = await Promise.all(
    Array.from(selectedFiles.value).map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'house_progress')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dfi7yg5yj/image/upload',
        { method: 'POST', body: formData }
      )

      const data = await res.json()
      return data.secure_url
    })
  )

  uploadImages.value.push(...urls)

  if (!uploadImages.value.length) return

  const col = collection($db, 'house_images')

  for (const url of uploadImages.value) {
    await addDoc(col, {
      url,
      createdAt: serverTimestamp(),
    })
  }

  // reset
  uploadImages.value = []
  selectedFiles.value = []
  fileInput.value.value = null
  uploading.value = false
}


// Add expense
const addExpense = async () => {
  if (!form.value.amount) return

  const payload = {
    ...form.value,
    amount: Number(form.value.amount),
  }

  if (editingId.value) {
    // update existing
    const d = doc($db, 'expenses', editingId.value)
    await updateDoc(d, payload)
    editingId.value = null
  } else {
    await addDoc(expensesCol, {
      ...payload,
      createdAt: serverTimestamp()
    })
  }

  // reset form
  form.value.amount = '';
  form.value.note = '';
  form.value.count = 1;
  form.value.qty = 1;
  form.value.category = '';
  form.value.status = 'completed';
  form.value.type = 'labor';
  form.value.date = new Date().toISOString().slice(0, 10);
  isFormOpen.value = false;
}

const editExpense = async (e) => {
  editingId.value = e.id
  form.value.date = e.date || new Date().toISOString().slice(0, 10)
  form.value.type = e.type || 'labor'
  form.value.count = e.count || 1
  form.value.category = e.category || ''
  form.value.qty = e.qty || 1
  form.value.amount = String(e.amount || '')
  form.value.note = e.note || ''
  form.value.status = e.status || 'completed'
  isFormOpen.value = true
  await nextTick()
  if (formEl.value) {
    formEl.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const first = formEl.value.querySelector('input, select, textarea')
    if (first && typeof first.focus === 'function') first.focus()
  }
}

const cancelEdit = () => {
  editingId.value = null
  // reset form to defaults
  form.value.amount = '';
  form.value.note = '';
  form.value.count = 1;
  form.value.qty = 1;
  form.value.category = '';
  form.value.status = 'completed';
  form.value.type = 'labor';
  form.value.date = new Date().toISOString().slice(0, 10);
  isFormOpen.value = false;
}

// Fetch expenses realtime
onMounted(() => {
  const q = query(expensesCol, orderBy('date', 'desc'))
  onSnapshot(q, (snap) => {
    expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
  // load budget from localStorage (client-side)
  try {
    const saved = localStorage.getItem('budget')
    if (saved !== null) budget.value = Number(saved)
  } catch (e) {
    // ignore (SSR or restricted)
  }

  const imageQuery = query(
    collection($db, 'house_images'),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(imageQuery, snap => {
    houseImages.value = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }))
  })
});

const laborTotal = computed(() =>
  expenses.value.filter(e => e.type === 'labor')
    .reduce((s, e) => s + Number(e.amount), 0)
)

const materialTotal = computed(() =>
  expenses.value.filter(e => e.type === 'material')
    .reduce((s, e) => s + Number(e.amount), 0)
)

const foodTotal = computed(() =>
  expenses.value.filter(e => e.type === 'food')
    .reduce((s, e) => s + Number(e.amount), 0)
)

const laborCountTotal = computed(() =>
  expenses.value
    .filter(e => e.type === 'labor')
    .reduce((s, e) => s + Number(e.count || 0), 0)
)

const materialCategorySummary = computed(() => {
  const map = {}

  expenses.value
    .filter(e => e.type === 'material')
    .forEach(e => {
      const cat = e.category || 'အခြား'
      const qty = Number(e.qty || 0)
      const unitPrice = Number(e.amount || 0) / qty

      if (!map[cat]) {
        map[cat] = { totalQty: 0, unitPrice: unitPrice }
      }

      map[cat].totalQty += qty
      // keep unitPrice (assuming same unit price for all same category)
      map[cat].unitPrice = unitPrice
    })

  return Object.entries(map).map(([category, data]) => {
    const totalAmount = data.totalQty * data.unitPrice
    return {
      category,
      details: `${data.totalQty} × ${data.unitPrice.toLocaleString()} = ${totalAmount.toLocaleString()}`
    }
  })
})


const grandTotal = computed(() =>
  laborTotal.value + materialTotal.value + foodTotal.value
)

const currentAmount = computed(() => Number(budget.value) - Number(grandTotal.value))

const completedExpenses = computed(() =>
  expenses.value.filter(e => (e.status || 'completed') === 'completed')
)

const pendingTotal = computed(() =>
  filteredPendingExpenses.value.reduce((s, e) => s + Number(e.amount || 0), 0)
)

const completedTotal = computed(() =>
  completedExpenses.value.reduce((s, e) => s + Number(e.amount || 0), 0)
)

const startEditBudget = () => {
  tempBudget.value = String(budget.value || '')
  isEditingBudget.value = true
}

const saveBudget = () => {
  const val = Number(tempBudget.value || 0)
  budget.value = val
  try { localStorage.setItem('budget', String(val)) } catch (e) { }
  isEditingBudget.value = false
}

const cancelEditBudget = () => {
  isEditingBudget.value = false
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
