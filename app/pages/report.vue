<template>
  <div class="min-h-screen bg-slate-50 p-4 pb-20">
    <div class="max-w-md mx-auto space-y-4">

      <!-- Header -->
      <div class="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between">
        <button @click="offset--" class="text-xl text-slate-500 hover:text-slate-700">⬅️</button>

        <div class="text-center">
          <h1 class="text-base font-semibold text-slate-800">
            📊 {{ reportMode === 'week' ? 'အပတ်စဉ် စာရင်း' : 'လစဉ် စာရင်း' }}
          </h1>
          <p class="text-xs text-slate-500 mt-1">{{ rangeText }}</p>
        </div>

        <button @click="offset++" class="text-xl text-slate-500 hover:text-slate-700">➡️</button>
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

      <!-- PDF -->
      <button @click="exportPDF"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition">
        📄 PDF Download
      </button>

      <!-- Summary -->
      <div class="space-y-3">
        <!-- Grand Total -->
        <SummaryCard class="bg-white border border-slate-200 border-l-4 border-l-blue-400"
          title="💰 စုစုပေါင်းကုန်ကျငွေ" :value="grandTotal" />

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

      <!-- Daily -->
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <h2 class="font-semibold text-slate-800 mb-3">📅 နေ့အလိုက်</h2>

        <div v-for="(d, i) in dailyBreakdown" :key="i" class="flex justify-between border-b py-2 last:border-0 text-sm">
          <span class="text-slate-600">{{ d.date }}</span>
          <span class="font-medium">{{ d.total.toLocaleString() }} ကျပ်</span>
        </div>

        <p v-if="dailyBreakdown.length === 0" class="text-center text-slate-400 text-sm py-6">
          စာရင်းမရှိပါ
        </p>
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

  <!-- PDF CONTENT -->
  <div id="report-pdf" class="bg-white" style="width:210mm; min-height:297mm; padding:15mm; font-family: system-ui;">
    <h1 class="text-xl font-bold text-center mb-4">
      🏠 အိမ်ဆောက် ကုန်ကျစရိတ် စာရင်း
    </h1>

    <p class="text-center text-sm text-slate-500 mb-6 border-b pb-4">
      {{ rangeText }} ({{ reportMode === 'week' ? 'အပတ်စဉ်' : 'လစဉ်' }})
    </p>

    <!-- SIMPLE SUMMARY CARDS -->
    <div class="mb-4 space-y-2">
      <!-- GRAND TOTAL -->
      <div class="font-bold text-lg mb-1">စုစုပေါင်း - {{ grandTotal.toLocaleString() }} ကျပ်</div>

      <!-- LABOR -->
      <div class="font-bold text-lg mb-1">အလုပ်သမားခ - {{ laborTotal.toLocaleString() }} ကျပ်</div>
      <div class="text-xs text-gray-600">
        လူဦးရေ = {{ laborCountTotal }} ဦး
      </div>

      <!-- MATERIAL -->
      <div class="font-bold text-lg pb-2">ပစ္စည်းဝယ် - {{ materialTotal.toLocaleString() }} ကျပ်</div>
      <div class="text-xs text-gray-600 mt-1">
        <div v-for="(m, i) in materialCategorySummary" :key="i" class="mb-1">
          • {{ m.category }} - {{ m.details }} ကျပ်
        </div>
      </div>

      <!-- FOOD -->
      <div class="font-bold text-lg mb-1">အစားသောက် - {{ foodTotal.toLocaleString() }} ကျပ်</div>
    </div>

    <h2 class="text-lg font-bold mb-3 py-4 border-b border-top border-gray-300 text-center">အသေးစိတ် စာရင်း</h2>
    <table class="w-full text-sm border-collapse">
      <thead>
        <tr class="border-b">
          <th class="text-left py-2">နေ့စွဲ</th>
          <th class="text-left py-2">အမျိုးအစား</th>
          <th class="text-left py-2">အကြောင်းအရာ</th>
          <th class="text-right py-2">ကျပ်</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(e, i) in filtered" :key="i" class="border-b">
          <td class="py-2">{{ e.date }}</td>
          <td class="py-2">{{ e.type === 'labor' ? 'အလုပ်သမားခ' : e.type === 'material' ? 'ပစ္စည်းဝယ်' : 'အစားသောက်' }}
          </td>
          <td class="py-2">
            <div v-if="e.type === 'material'">{{ e.category }} - {{ e.qty }} × {{ (e.amount / e.qty).toLocaleString() }}
            </div>
            <div v-if="e.type === 'labor'">{{ e.count }} ဦး</div>
          </td>
          <td class="py-2 text-right">{{ e.amount.toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div class="text-right font-bold mt-4">
      စုစုပေါင်း - {{ grandTotal.toLocaleString() }} ကျပ်
    </div>

    <div class="mt-8 pt-3 border-t border-gray-300 text-xs text-gray-500">
      <div class="flex justify-between">
        <div>
          <div>ပြင်ဆင်သည့်ရက်စွဲ - {{ new Date().toLocaleDateString() }}</div>
          <div class="mt-0.5">စုစုပေါင်းစာရင်း - {{ filtered.length }} ခု</div>
        </div>
        <div class="text-right">
          <div>စာရင်းအမျိုးအစား - {{ reportMode === 'week' ? 'အပတ်စဉ်' : 'လစဉ်' }}</div>
          <div class="mt-0.5">စာမျက်နှာ - 1</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const { $db } = useNuxtApp()

const expenses = ref([])
const reportMode = ref('week')
const offset = ref(0)

/* Firebase */
onMounted(() => {
  const q = query(collection($db, 'expenses'), orderBy('createdAt', 'desc'))
  onSnapshot(q, snap => {
    expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  })
})

/* Date Range */
const startDate = computed(() => {
  const d = new Date()
  if (reportMode.value === 'week') {
    const day = d.getDay() || 7
    d.setDate(d.getDate() - day + 1 + offset.value * 7)
  } else {
    d.setDate(1)
    d.setMonth(d.getMonth() + offset.value)
  }
  d.setHours(0, 0, 0, 0)
  return d
})

const endDate = computed(() => {
  const d = new Date(startDate.value)
  if (reportMode.value === 'week') d.setDate(d.getDate() + 6)
  else d.setMonth(d.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
})

const rangeText = computed(() =>
  `${startDate.value.toISOString().slice(0, 10)} ~ ${endDate.value.toISOString().slice(0, 10)}`
)

/* Filter */
const filtered = computed(() =>
  expenses.value.filter(e => {
    if (!e.date) return false
    const d = new Date(e.date)
    return d >= startDate.value && d <= endDate.value
  })
)

/* Totals */
const sumBy = type =>
  filtered.value.filter(e => e.type === type).reduce((s, e) => s + Number(e.amount), 0)

const laborTotal = computed(() => sumBy('labor'))
const materialTotal = computed(() => sumBy('material'))
const foodTotal = computed(() => sumBy('food'))
const grandTotal = computed(() => laborTotal.value + materialTotal.value + foodTotal.value)

const laborCountTotal = computed(() =>
  filtered.value.filter(e => e.type === 'labor').reduce((s, e) => s + Number(e.count || 0), 0)
)

const dailyBreakdown = computed(() => {
  const map = {}
  filtered.value.forEach(e => {
    map[e.date] = (map[e.date] || 0) + Number(e.amount)
  })
  return Object.entries(map).map(([date, total]) => ({ date, total }))
})

const materialCategorySummary = computed(() => {
  const map = {}
  filtered.value.filter(e => e.type === 'material').forEach(e => {
    const cat = e.category || 'အခြား'
    const qty = Number(e.qty || 1)
    const price = e.amount / qty
    if (!map[cat]) map[cat] = { qty: 0, price }
    map[cat].qty += qty
  })
  return Object.entries(map).map(([category, d]) => ({
    category,
    details: `${d.qty} × ${d.price.toLocaleString()}`
  }))
})

/* PDF */
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

const activeBtn = 'bg-blue-500 text-white'
const inactiveBtn = 'bg-white border border-slate-200 text-slate-600'
</script>

<style scoped>
#report-pdf {
  position: fixed;
  left: -9999px;
  top: 0;
}
</style>
