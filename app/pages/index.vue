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
        <SummaryCard
          class="bg-white border border-slate-200 border-l-4 border-l-indigo-400"
          title="🎯 ဘတ်ဂျက်"
          :value="budget"
        >
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 space-y-2 border-t pt-2">
                <div v-if="!isEditingBudget" class="flex items-center justify-between">
                  <div>လက်ကျန်: <span class="font-medium">{{ currentAmount.toLocaleString() }} ကျပ်</span></div>
                  <button @click="startEditBudget" class="text-sm text-indigo-600">ပြင်မယ်</button>
                </div>

              <div v-else class="space-y-2">
                <input
                  type="number"
                  v-model="tempBudget"
                  class="w-full rounded-xl border border-slate-300 p-2"
                />
                <div class="flex gap-2">
                  <button
                    @click="saveBudget"
                    class="flex-1 bg-indigo-500 text-white rounded-xl py-2"
                  >
                    သိမ်းမယ်
                  </button>
                  <button
                    @click="cancelEditBudget"
                    class="flex-1 border border-slate-300 rounded-xl py-2"
                  >
                    မပြင်တော့
                  </button>
                </div>
              </div>
            </div>
          </template>
        </SummaryCard>

        <!-- Grand Total -->
        <SummaryCard
          class="bg-white border border-slate-200 border-l-4 border-l-blue-400"
          title="💰 စုစုပေါင်းကုန်ကျငွေ"
          :value="grandTotal"
        />

        <!-- Labor -->
        <SummaryCard
          class="bg-white border border-slate-200 border-l-4 border-l-slate-500"
          title="👷 အလုပ်သမားခ"
          :value="laborTotal"
        >
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 border-t pt-2">
              လူဦးရေစုစုပေါင်း — {{ laborCountTotal }} ဦး
            </div>
          </template>
        </SummaryCard>

        <!-- Material -->
        <SummaryCard
          class="bg-white border border-slate-200 border-l-4 border-l-slate-600"
          title="🧱 ပစ္စည်းဝယ်"
          :value="materialTotal"
        >
          <template #extra>
            <div class="mt-2 text-xs text-slate-600 space-y-1 border-t pt-2">
              <div
                v-for="(m, i) in materialCategorySummary"
                :key="i"
                class="flex justify-between"
              >
                <span>{{ m.category }}</span>
                <span class="font-medium">{{ m.details }} ကျပ်</span>
              </div>
            </div>
          </template>
        </SummaryCard>

        <!-- Food -->
        <SummaryCard
          class="bg-white border border-slate-200 border-l-4 border-l-slate-400"
          title="🍽️ အစားသောက်"
          :value="foodTotal"
        />
      </div>

      <!-- Add Form -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <button
          @click="isFormOpen = !isFormOpen"
          class="w-full flex justify-between items-center font-semibold text-slate-700"
        >
          <span>➕ စာရင်းထည့်ရန်</span>
          <span :class="isFormOpen ? 'rotate-180' : ''">▼</span>
        </button>

        <form
          v-show="isFormOpen"
          @submit.prevent="addExpense"
          class="space-y-3 mt-4"
        >
          <FormInput label="နေ့" type="date" v-model="form.date" />

          <select
            v-model="form.type"
            class="w-full rounded-xl border border-slate-300 p-2"
          >
            <option value="labor">👷 အလုပ်သမားခ</option>
            <option value="material">🧱 ပစ္စည်းဝယ်</option>
            <option value="food">🍽️ အစားသောက်</option>
          </select>

          <FormInput
            v-if="form.type === 'labor'"
            label="လူဦးရေ"
            type="number"
            v-model="form.count"
          />

          <FormInput
            v-if="form.type === 'material'"
            label="ပစ္စည်းအမျိုးအစား"
            v-model="form.category"
          />

          <FormInput
            v-if="form.type === 'material'"
            label="အရေအတွက်"
            type="number"
            v-model="form.qty"
          />

          <FormInput
            label="ငွေပမာဏ (ကျပ်)"
            type="number"
            v-model="form.amount"
          />

          <FormInput label="မှတ်ချက်" v-model="form.note" />

          <button
            class="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3 font-medium"
          >
            သိမ်းမယ်
          </button>
        </form>
      </div>

      <!-- Expense List -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h2 class="font-semibold mb-3 text-slate-700">📋 စာရင်း</h2>

        <div
          v-for="(e, i) in expenses"
          :key="i"
          class="flex justify-between border-b border-slate-100 py-3 last:border-0"
        >
          <div>
            <p class="text-xs text-slate-400">{{ e.date }}</p>
            <p class="font-medium text-slate-700">
              <span v-if="e.type === 'labor'">👷 ({{ e.count }} ဦး)</span>
              <span v-else-if="e.type === 'material'">🧱 {{ e.category }} × {{ e.qty }}</span>
              <span v-else>🍽️ အစားသောက်</span>
            </p>
          </div>
          <p class="font-semibold text-slate-800">
            {{ e.amount.toLocaleString() }} ကျပ်
          </p>
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'

const { $db } = useNuxtApp()  // <-- here

const expenses = ref([]);
const isFormOpen = ref(false);

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
  note: ''
})

const expensesCol = collection($db, 'expenses')

// Add expense
const addExpense = async () => {
  if (!form.value.amount) return
  await addDoc(expensesCol, {
    ...form.value,
    amount: Number(form.value.amount),
    createdAt: serverTimestamp()
  })
  form.value.amount = '';
  form.value.note = '';
  form.value.count = 1;
  form.value.qty = 1;
  form.value.category = '';
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
      details: `${data.totalQty} * ${data.unitPrice.toLocaleString()} = ${totalAmount.toLocaleString()}`
    }
  })
})


const grandTotal = computed(() =>
  laborTotal.value + materialTotal.value + foodTotal.value
)

const currentAmount = computed(() => Number(budget.value) - Number(grandTotal.value))

const startEditBudget = () => {
  tempBudget.value = String(budget.value || '')
  isEditingBudget.value = true
}

const saveBudget = () => {
  const val = Number(tempBudget.value || 0)
  budget.value = val
  try { localStorage.setItem('budget', String(val)) } catch (e) {}
  isEditingBudget.value = false
}

const cancelEditBudget = () => {
  isEditingBudget.value = false
}
</script>
