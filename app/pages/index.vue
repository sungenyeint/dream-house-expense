<template>
  <div class="min-h-screen bg-slate-50 p-4">
    <div class="max-w-md mx-auto space-y-6">

      <!-- Header -->
      <div class="bg-white rounded-2xl shadow p-5">
        <h1 class="text-xl font-semibold text-slate-800">
          🏠 အိမ်ဆောက် ကုန်ကျစရိတ်
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          အလုပ်သမား · ပစ္စည်း · အစားသောက် စာရင်း
        </p>
      </div>

      <!-- Summary -->
      <div class="space-y-3">
        <!-- Grand Total -->
        <div class="bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl p-4">
          <p class="text-xs uppercase tracking-wide opacity-70">စုစုပေါင်း</p>
          <p class="text-2xl font-bold mt-1">
            {{ grandTotal.toLocaleString() }} ကျပ်
          </p>
        </div>
        <SummaryCard class="bg-purple-50 border-purple-200" title="အလုပ်သမားခ" :value="laborTotal" icon="👷" />
        <SummaryCard class="bg-green-50 border-green-200" title="ပစ္စည်းဝယ်" :value="materialTotal" icon="🧱" />
        <SummaryCard class="bg-yellow-50 border-yellow-200" title="အစားသောက်" :value="foodTotal" icon="🍽️" />
      </div>

      <!-- Form -->
      <div class="bg-white rounded-2xl shadow p-5">

        <!-- Toggle Header -->
        <button @click="isFormOpen = !isFormOpen" class="w-full flex items-center justify-between font-semibold">

          <span>➕ စာရင်းထည့်ရန်</span>

          <span class="transition-transform duration-200" :class="isFormOpen ? 'rotate-180' : ''">
            ▼
          </span>
        </button>

        <!-- Collapsible Form -->
        <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-[800px]" leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 max-h-[800px]" leave-to-class="opacity-0 max-h-0">
          <form v-show="isFormOpen" @submit.prevent="addExpense" class="space-y-3 mt-4 overflow-hidden">

            <FormInput label="နေ့" type="date" v-model="form.date" />

            <div>
              <label class="text-sm text-slate-600">အမျိုးအစား</label>
              <select v-model="form.type"
                class="w-full mt-1 rounded-xl border border-slate-300 p-2 focus:ring-2 focus:ring-blue-300">
                <option value="labor">👷 အလုပ်သမားခ</option>
                <option value="material">🧱 ပစ္စည်းဝယ်</option>
                <option value="food">🍽️ အစားသောက်</option>
              </select>
            </div>

            <!-- Labor -->
            <FormInput v-if="form.type === 'labor'" label="လူဦးရေ" type="number" v-model="form.count" />

            <!-- Material -->
            <FormInput v-if="form.type === 'material'" label="ပစ္စည်းအမျိုးအစား" placeholder="ဥပမာ - သံ"
              v-model="form.category" />

            <FormInput v-if="form.type === 'material'" label="အရေအတွက်" type="number" v-model="form.qty" />

            <!-- Amount -->
            <FormInput label="ငွေပမာဏ (ကျပ်)" type="number" v-model="form.amount" />

            <button class="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 font-medium transition">
              ✔ သိမ်းမယ်
            </button>

          </form>
        </transition>

      </div>


      <!-- List -->
      <div class="bg-white rounded-2xl shadow p-5 mb-5">
        <h2 class="font-semibold mb-3">📋 စာရင်း</h2>

        <div v-for="(e, i) in expenses" :key="i" class="flex justify-between items-center border-b py-3 last:border-0">

          <div>
            <p class="text-xs text-slate-400">{{ e.date }}</p>
            <p class="font-medium text-slate-700">
              <span v-if="e.type === 'labor'">👷 {{ e.worker }} ({{ e.count }} ဦး)</span>
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
  <div class="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around p-2">
    <NuxtLink to="/" class="flex flex-col items-center text-sm">🏠<span>Home</span></NuxtLink>
    <NuxtLink to="/report" class="flex flex-col items-center text-sm">📊<span>Report</span></NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore'

const { $db } = useNuxtApp()  // <-- here

const expenses = ref([]);
const isFormOpen = ref(false);

const form = ref({
  date: new Date().toISOString().slice(0, 10),
  type: 'labor',
  worker: '',
  count: 1,
  category: '',
  qty: 1,
  amount: ''
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
  isFormOpen.value = false;
}

// Fetch expenses realtime
onMounted(() => {
  const q = query(expensesCol, orderBy('createdAt', 'desc'))
  onSnapshot(q, (snap) => {
    expenses.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
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

const grandTotal = computed(() =>
  laborTotal.value + materialTotal.value + foodTotal.value
)
</script>
