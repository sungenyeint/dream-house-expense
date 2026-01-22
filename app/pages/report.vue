<template>
  <div class="min-h-screen bg-slate-50 p-4 pb-20">
    <div class="max-w-md mx-auto space-y-4">

      <!-- Header + Week Nav -->
      <div class="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <button @click="offset--" class="text-xl">⬅️</button>

        <div class="text-center">
          <h1 class="text-lg font-semibold mb-1">
            📊 {{ reportMode === 'week' ? 'အပတ်စဉ် စာရင်း' : 'လစဉ် စာရင်း' }}
          </h1>
          <p class="text-xs text-slate-500">{{ rangeText }}</p>
        </div>

        <button @click="offset++" class="text-xl">➡️</button>
      </div>

      <!-- Mode Switch -->
      <div class="flex gap-2">
        <button @click="reportMode = 'week'" :class="reportMode === 'week' ? activeBtn : inactiveBtn"
          class="flex-1 py-2 rounded-xl text-sm">
          🗓️ အပတ်စဉ်
        </button>

        <button @click="reportMode = 'month'" :class="reportMode === 'month' ? activeBtn : inactiveBtn"
          class="flex-1 py-2 rounded-xl text-sm">
          📆 လစဉ်
        </button>
      </div>

      <!-- Summary -->
      <div class="space-y-3">
        <SummaryCard title="💰 စုစုပေါင်း" :value="grandTotal" color="blue" />
        <SummaryCard title="👷 အလုပ်သမားခ" :value="laborTotal" color="purple">
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 space-y-1 border-t pt-2">
              🧑‍🤝‍🧑 လူဦးရေစုစုပေါင်း - {{ laborCountTotal }} ဦး
            </div>
          </template>
        </SummaryCard>
        <SummaryCard title="🧱 ပစ္စည်းဝယ်" :value="materialTotal" color="green">
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 space-y-1 border-t pt-2">
              <div v-for="(m, i) in materialCategorySummary" :key="i" class="flex justify-between">
                <span>{{ m.category }}</span>
                <span class="font-medium">{{ m.details }} ကျပ်</span>
              </div>
            </div>
          </template>
        </SummaryCard>
        <SummaryCard title="🍽️ အစားသောက်" :value="foodTotal" color="yellow" />
      </div>

      <!-- Daily -->
      <div class="bg-white rounded-2xl shadow p-4">
        <h2 class="font-semibold mb-3">📅 နေ့အလိုက်</h2>

        <div v-for="(d, i) in dailyBreakdown" :key="i" class="flex justify-between border-b py-2 last:border-0 text-sm">
          <span class="text-slate-600">{{ d.date }}</span>
          <span class="font-medium">{{ d.total.toLocaleString() }} ကျပ်</span>
        </div>

        <p v-if="dailyBreakdown.length === 0" class="text-center text-slate-400 text-sm py-6">
          စာရင်းမရှိပါ
        </p>
      </div>

      <!-- PDF -->
      <button @click="exportPDF" class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium">
        📄 PDF Download
      </button>

    </div>
  </div>

  <div class="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around p-2">
    <NuxtLink to="/" class="flex flex-col items-center text-sm">🏠<span>Home</span></NuxtLink>
    <NuxtLink to="/report" class="flex flex-col items-center text-sm">📊<span>Report</span></NuxtLink>
  </div>

  <!-- ================= PDF CONTENT ================= -->
  <div id="report-pdf" class="bg-white"
    style="width:210mm; min-height:297mm; padding:15mm; font-family: system-ui; box-sizing: border-box;">

    <!-- HEADER -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold mb-2">🏠 အိမ်ဆောက် ကုန်ကျစရိတ် စာရင်း</h1>
      <div class="text-lg font-medium text-gray-700">{{ rangeText }}</div>
      <div class="text-sm text-gray-500 mt-1">
        {{ reportMode === 'week' ? 'အပတ်စဉ် စာရင်း' : 'လစဉ် စာရင်း' }}
      </div>
    </div>

    <!-- SIMPLE SUMMARY CARDS -->
    <div class="mb-4 space-y-2">
      <!-- GRAND TOTAL -->
      <div class="p-3 border border-blue-300 bg-blue-50 rounded">
        <div class="font-bold text-sm mb-1">စုစုပေါင်း - {{ grandTotal.toLocaleString() }} ကျပ်</div>
      </div>

      <!-- LABOR -->
      <div class="p-3 border border-gray-200 bg-white rounded">
        <div class="font-bold text-sm mb-1">အလုပ်သမားခ - {{ laborTotal.toLocaleString() }} ကျပ်</div>
        <div class="text-xs text-gray-600">
          လူဦးရေ: {{ laborCountTotal }} ဦး
        </div>
      </div>

      <!-- MATERIAL -->
      <div class="p-3 border border-gray-200 bg-white rounded">
        <div class="font-bold text-sm pb-2 border-b">ပစ္စည်းဝယ် - {{ materialTotal.toLocaleString() }} ကျပ်</div>
        <div class="text-xs text-gray-600 mt-1">
          <div v-for="(m, i) in materialCategorySummary" :key="i">
            • {{ m.details }} ကျပ်
          </div>
        </div>
      </div>

      <!-- FOOD -->
      <div class="p-3 border border-gray-200 bg-white rounded">
        <div class="font-bold text-sm mb-1">အစားသောက် - {{ foodTotal.toLocaleString() }} ကျပ်</div>
      </div>
    </div>

    <!-- DETAILS TABLE WITH ROW UNDERLINES -->
    <div class="mb-8">
      <h2 class="text-lg font-bold mb-3 pb-4 border-b border-gray-300">အသေးစိတ် စာရင်း</h2>
      <div class="w-full">
        <!-- Table Header -->
        <div class="flex border-b border-gray-400 pb-4 mb-1 font-bold text-sm">
          <div class="w-1/4 pl-1">နေ့စွဲ</div>
          <div class="w-1/4 pl-1">အမျိုးအစား</div>
          <div class="w-2/4 pl-1">အကြောင်းအရာ</div>
          <div class="w-1/4 pl-1 text-right">ကျပ်</div>
        </div>

        <!-- Table Rows -->
        <div v-for="(expense, index) in filtered" :key="index" class="flex border-b border-gray-300 pb-2 text-sm">
          <div class="w-1/4 pl-1">{{ expense.date }}</div>
          <div class="w-1/4 pl-1">
            <span v-if="expense.type === 'labor'">အလုပ်သမား</span>
            <span v-else-if="expense.type === 'material'">ပစ္စည်း</span>
            <span v-else>အစားသောက်</span>
          </div>
          <div class="w-2/4 pl-1">
            <div>{{ expense.type === 'material' ? expense.category : expense.type === 'food' ? '-' : '' }}</div>
            <div class="text-xs text-gray-500">
              <span v-if="expense.qty && expense.type === 'material'">
                {{ expense.qty }} x {{ (expense.amount / expense.qty).toLocaleString() }} ကျပ်
              </span>
              <span v-if="expense.count && expense.type === 'labor'">
                {{ expense.count }} ဦး
              </span>
            </div>
          </div>
          <div class="w-1/4 pl-1 text-right font-medium">
            {{ Number(expense.amount).toLocaleString() }}
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filtered.length === 0" class="text-center py-4 text-gray-500 text-sm">
          ဒီကာလအတွင်း စာရင်းမရှိပါ
        </div>

        <!-- Total Row -->
        <div v-if="filtered.length > 0" class="flex border-gray-500 pt-2 mt-2 font-bold">
          <div class="w-3/4 pl-1 text-right">စုစုပေါင်း:</div>
          <div class="w-1/4 pl-1 text-right">{{ grandTotal.toLocaleString() }} ကျပ်</div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="mt-8 pt-3 border-t border-gray-300 text-xs text-gray-500">
      <div class="flex justify-between">
        <div>
          <div>ပြင်ဆင်သည့်ရက်စွဲ: {{ new Date().toLocaleDateString() }}</div>
          <div class="mt-0.5">စုစုပေါင်းစာရင်း: {{ filtered.length }} ခု</div>
        </div>
        <div class="text-right">
          <div>စာရင်းအမျိုးအစား: {{ reportMode === 'week' ? 'အပတ်စဉ်' : 'လစဉ်' }}</div>
          <div class="mt-0.5">စာမျက်နှာ: 1</div>
        </div>
      </div>
    </div>

  </div>

  <!-- ================= END PDF CONTENT ================= -->


</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { $db } = useNuxtApp()

/* ---------------- STATE ---------------- */
const expenses = ref([])
const reportMode = ref('week') // week | month
const offset = ref(0)

/* ---------------- FIREBASE ---------------- */
onMounted(() => {
  const q = query(collection($db, 'expenses'), orderBy('createdAt', 'desc'))
  onSnapshot(q, snap => {
    expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
})

/* ---------------- DATE RANGE ---------------- */
const startDate = computed(() => {
  if (reportMode.value === 'week') {
    const d = new Date()
    const day = d.getDay() || 7 // Sunday fix
    d.setDate(d.getDate() - day + 1 + offset.value * 7)
    d.setHours(0, 0, 0, 0)
    return d
  } else {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() + offset.value)
    d.setHours(0, 0, 0, 0)
    return d
  }
})

const endDate = computed(() => {
  if (reportMode.value === 'week') {
    const d = new Date(startDate.value)
    d.setDate(d.getDate() + 6)
    d.setHours(23, 59, 59, 999)
    return d
  } else {
    const d = new Date(startDate.value)
    d.setMonth(d.getMonth() + 1)
    d.setDate(0)
    d.setHours(23, 59, 59, 999)
    return d
  }
})

const rangeText = computed(() =>
  `${startDate.value.toISOString().slice(0, 10)} ~ ${endDate.value.toISOString().slice(0, 10)}`
)

/* ---------------- FILTER ---------------- */
const filtered = computed(() =>
  expenses.value.filter(e => {
    if (!e.date) return false
    const d = new Date(e.date)
    return d >= startDate.value && d <= endDate.value
  })
)

/* ---------------- TOTALS ---------------- */
const sumBy = type =>
  filtered.value
    .filter(e => e.type === type)
    .reduce((s, e) => s + Number(e.amount), 0)

const laborTotal = computed(() => sumBy('labor'))
const materialTotal = computed(() => sumBy('material'))
const foodTotal = computed(() => sumBy('food'))
const grandTotal = computed(() => laborTotal.value + materialTotal.value + foodTotal.value)

/* ---------------- DAILY ---------------- */
const dailyBreakdown = computed(() => {
  const map = {}
  filtered.value.forEach(e => {
    if (!map[e.date]) map[e.date] = 0
    map[e.date] += Number(e.amount)
  })
  return Object.entries(map).map(([date, total]) => ({ date, total }))
})

const laborCountTotal = computed(() =>
  filtered.value
    .filter(e => e.type === 'labor')
    .reduce((s, e) => s + Number(e.count || 0), 0)
)

/* ---------------- MATERIAL CATEGORY SUMMARY ---------------- */
const materialCategorySummary = computed(() => {
  const map = {}

  filtered.value
    .filter(e => e.type === 'material')
    .forEach(e => {
      const cat = e.category || 'အခြား'
      const qty = Number(e.qty || 0)
      const unitPrice = Number(e.amount || 0) / qty

      if (!map[cat]) map[cat] = { totalQty: 0, unitPrice }
      map[cat].totalQty += qty
    })

  return Object.entries(map).map(([category, data]) => {
    const totalAmount = data.totalQty * data.unitPrice
    return {
      category,
      qty: data.totalQty,
      price: data.unitPrice,
      details: `${data.totalQty} * ${data.unitPrice.toLocaleString()} = ${totalAmount.toLocaleString()}`
    }
  })
})

const exportPDF = async () => {
  const element = document.getElementById('report-pdf')
  if (!element) return

  // Add loading indicator
  const originalText = document.querySelector('button[onclick="exportPDF"]')?.textContent
  const button = document.querySelector('button[onclick="exportPDF"]')
  if (button) {
    button.textContent = '🔄 PDF ပြင်ဆင်နေသည်...'
    button.disabled = true
  }

  try {
    // Calculate optimal scale
    const pdfWidth = 210 // A4 width in mm
    const pdfHeight = 297 // A4 height in mm
    const margin = 10 // mm margin

    // 1️⃣ Convert HTML → Canvas with better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.95)

    // Calculate image dimensions for A4
    const imgWidth = pdfWidth - (margin * 2)
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // 2️⃣ Create PDF in portrait mode (better for reading)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Check if content fits on one page
    if (imgHeight > pdfHeight) {
      // Multiple pages needed
      let heightLeft = imgHeight
      let position = 0
      const pageHeight = pdfHeight - (margin * 2)

      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
    } else {
      // Single page
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight)
    }

    // Generate filename
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const modeStr = reportMode.value === 'week' ? 'week' : 'month'
    const filename = `အိမ်ဆောက်စရိတ်-${modeStr}-${dateStr}.pdf`

    // Save PDF
    pdf.save(filename)

    // Show success message
    alert('✅ PDF ဒေါင်းလုတ်လုပ်ပြီးပါပြီ!')

  } catch (error) {
    console.error('PDF export error:', error)
    alert('❌ PDF ဒေါင်းလုတ်လုပ်ရာတွင် အမှားတစ်ခုဖြစ်နေပါသည်။')
  } finally {
    // Restore button
    if (button && originalText) {
      button.textContent = originalText
      button.disabled = false
    }
  }
}

/* ---------------- UI ---------------- */
const activeBtn = 'bg-blue-500 text-white'
const inactiveBtn = 'bg-white border text-slate-600'
</script>

<style scoped>
/* PDF specific styles */
#report-pdf {
  position: fixed;
  left: -10000px;
  top: 0;
  background: white;
  z-index: -9999;
}

#report-pdf * {
  font-family: 'Myanmar3', 'Padauk', 'Noto Sans Myanmar', sans-serif;
  line-height: 1.4;
}

/* Ensure proper spacing for printing */
@media print {
  #report-pdf {
    position: static;
    margin: 0;
    padding: 15mm;
  }
}
</style>
