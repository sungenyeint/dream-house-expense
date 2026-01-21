<template>
  <div class="min-h-screen bg-slate-50 p-4 pb-20">
    <div class="max-w-md mx-auto space-y-4">

      <!-- Header + Week Nav -->
      <div class="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <button @click="offset--" class="text-xl">⬅️</button>

        <div class="text-center">
          <h1 class="text-lg font-semibold">
            📊 {{ reportMode === 'week' ? 'အပတ်စဉ် စာရင်း' : 'လစဉ် စာရင်း' }}
          </h1>
          <p class="text-xs text-slate-500">
            {{ rangeText }}
          </p>
        </div>

        <button @click="offset++" class="text-xl">➡️</button>
      </div>

      <!-- Mode Switch -->
      <div class="flex gap-2">
        <button
          @click="reportMode='week'"
          :class="reportMode==='week' ? activeBtn : inactiveBtn"
          class="flex-1 py-2 rounded-xl text-sm">
          🗓️ အပတ်စဉ်
        </button>

        <button
          @click="reportMode='month'"
          :class="reportMode==='month' ? activeBtn : inactiveBtn"
          class="flex-1 py-2 rounded-xl text-sm">
          📆 လစဉ်
        </button>
      </div>

      <!-- Summary -->
      <div class="grid grid-cols-2 gap-3">
        <SummaryBox title="👷 အလုပ်သမားခ" :value="laborTotal" color="purple" />
        <SummaryBox title="🧱 ပစ္စည်းဝယ်" :value="materialTotal" color="green" />
        <SummaryBox title="🍽️ အစားသောက်" :value="foodTotal" color="yellow" />
        <SummaryBox title="💰 စုစုပေါင်း" :value="grandTotal" color="blue" />
      </div>

      <!-- Daily -->
      <div class="bg-white rounded-2xl shadow p-4">
        <h2 class="font-semibold mb-3">📅 နေ့အလိုက်</h2>

        <div
          v-for="(d,i) in dailyBreakdown"
          :key="i"
          class="flex justify-between border-b py-2 last:border-0 text-sm"
        >
          <span class="text-slate-600">{{ d.date }} {{ d.type }}</span>
          <span class="font-medium">{{ d.total.toLocaleString() }} ကျပ်</span>
        </div>

        <p v-if="dailyBreakdown.length === 0" class="text-center text-slate-400 text-sm py-6">
          စာရင်းမရှိပါ
        </p>
      </div>

      <!-- PDF -->
      <button
        @click="exportPDF"
        class="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium">
        📄 PDF Download
      </button>

    </div>
  </div>
  <div class="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around p-2">
    <NuxtLink to="/" class="flex flex-col items-center text-sm">🏠<span>Home</span></NuxtLink>
    <NuxtLink to="/report" class="flex flex-col items-center text-sm">📊<span>Report</span></NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  const d = new Date()
  if (reportMode.value === 'week') {
    d.setDate(d.getDate() - d.getDay() + 1 + offset.value * 7)
  } else {
    d.setMonth(d.getMonth() + offset.value, 1)
  }
  return d
})

const endDate = computed(() => {
  const d = new Date(startDate.value)
  if (reportMode.value === 'week') {
    d.setDate(d.getDate() + 6)
  } else {
    d.setMonth(d.getMonth() + 1)
    d.setDate(0)
  }
  return d
})

const rangeText = computed(() =>
  `${startDate.value.toISOString().slice(0,10)} ~ ${endDate.value.toISOString().slice(0,10)}`
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
    .reduce((s,e)=>s+Number(e.amount),0)

const laborTotal = computed(()=>sumBy('labor'))
const materialTotal = computed(()=>sumBy('material'))
const foodTotal = computed(()=>sumBy('food'))

const grandTotal = computed(() =>
  laborTotal.value + materialTotal.value + foodTotal.value
)

/* ---------------- DAILY ---------------- */
const dailyBreakdown = computed(() => {
  const map = {}
  filtered.value.forEach(e => {
    if (!map[e.date]) map[e.date] = 0
    map[e.date] += Number(e.amount)
  })
  return Object.entries(map).map(([date,total])=>({date,total}))
})

/* ---------------- PDF ---------------- */
const exportPDF = () => {
  const doc = new jsPDF()

  doc.setFontSize(14)
  doc.text(
    reportMode.value === 'week' ? 'Weekly Expense Report' : 'Monthly Expense Report',
    14, 15
  )

  doc.setFontSize(10)
  doc.text(rangeText.value, 14, 22)

  autoTable(doc, {
    startY: 28,
    head: [['Date', 'Amount (Kyats)']],
    body: dailyBreakdown.value.map(d => [
      d.date,
      d.total.toLocaleString()
    ])
  })

  doc.text(
    `Total: ${grandTotal.value.toLocaleString()} Kyats`,
    14,
    doc.lastAutoTable.finalY + 10
  )

  doc.save(`${reportMode.value}-expense-report.pdf`)
}

/* ---------------- UI ---------------- */
const activeBtn = 'bg-blue-500 text-white'
const inactiveBtn = 'bg-white border text-slate-600'
</script>
