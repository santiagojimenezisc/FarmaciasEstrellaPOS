<template>
  <q-page padding>
    <div class="row">
      <div class="col q-gutter-md">
        <h5>Registra la cantidad correspondiente para cada campo</h5>
        <p>Al ingresar cada campo se actualizaran los montos en el ticket de corte.</p>
        <q-input
          v-model.number="manualSalesTotal"
          type="number"
          label="Venta total semanal"
          prefix="$"
          outlined
          dense
        />

        <!-- GASTOS FIJOS -->
        <q-input
          v-model.number="rentExpense"
          type="number"
          label="Renta"
          prefix="$"
          outlined
          dense
        />
        <q-input
          v-model.number="utilitiesExpense"
          type="number"
          label="Agua / Luz"
          prefix="$"
          outlined
          dense
        />
        <q-input
          v-model.number="payroll1"
          type="number"
          label="Nómina 1"
          prefix="$"
          outlined
          dense
        />
        <q-input
          v-model.number="payroll2"
          type="number"
          label="Nómina 2"
          prefix="$"
          outlined
          dense
        />
        <q-input
          v-model.number="internetExpense"
          type="number"
          label="Internet"
          prefix="$"
          outlined
          dense
        />
        <q-input
          v-model.number="cameraStorageExpense"
          type="number"
          label="Cámara / Almacenamiento"
          prefix="$"
          outlined
          dense
        />
        <!-- GASTOS VARIABLES -->
        <q-input
          v-model.number="logisticsExpense"
          type="number"
          label="Logística (gas, uber, caseta)"
          prefix="$"
          outlined
          dense
        />
        <div class="row w-100">
          <q-input
            v-model.number="mpCommissionExpense"
            type="number"
            label="Comisiones MercadoPago"
            prefix="$"
            outlined
            dense
          />

          <q-btn color="primary" label="Obtener"></q-btn>
        </div>

        <q-input
          v-model.number="cashAmount"
          type="number"
          label="Efectivo en caja"
          prefix="$"
          outlined
          dense
        />

        <q-input
          v-model.number="mpSalesAmount"
          type="number"
          label="Ventas MercadoPago"
          prefix="$"
          outlined
          dense
        />

        <q-btn color="primary" label="Calcular"></q-btn>
      </div>
      <div class="col q-pa-lg">
        <q-card class="flat bordered my-card">
          <q-card-section>
            <div class="text-h6">Corte de caja</div>
            <div class="text-subtitle2">11 Marzo 2026 - 18 Marzo 2026</div>
          </q-card-section>

          <q-separator inset />

          <q-card-section>
            <h6>
              Total gastos fijos:
              <strong>${{ totalFixedExpenses.toFixed(2) }}</strong>
            </h6>

            <h6>
              Ganancia administrador:
              <strong>${{ adminProfit.toFixed(2) }}</strong>
            </h6>
            <h6>
              Fondo farmacia:
              <strong>${{ pharmacyFundProfit.toFixed(2) }}</strong>
            </h6>
            <h6>
              Total gastos variables:
              <strong>${{ totalVariableExpenses.toFixed(2) }}</strong>
            </h6>
            <!-- RESULTADO FINAL -->
            <h6>
              Gastos operativos totales:
              <strong>${{ totalOperationalExpenses.toFixed(2) }}</strong>
            </h6>
            <h6>
              Dinero final disponible para surtir:
              <strong>${{ stockPurchaseNet.toFixed(2) }}</strong>
            </h6>
            <h6>
              Total combinado: ${{ combinedSalesTotal.toFixed(2) }}
              <span v-if="isSalesMatching">😄 Todo coincide</span>
              <span v-else>😠 No cuadra</span>
            </h6>

            <h6>
              Total combinado: ${{ combinedSalesTotal.toFixed(2) }}

              <span v-if="differenceAmount === 0"> 😄 </span>
              <span v-else> 😠 </span>

              <div>{{ differenceMessage }}</div>
            </h6>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'

const manualSalesTotal = ref<number>(0)
const adminProfit = computed(() => {
  return manualSalesTotal.value * 0.28
})
const pharmacyFundProfit = computed(() => {
  return manualSalesTotal.value * 0.1
})
const totalFixedExpenses = computed(() => {
  return (
    rentExpense.value +
    utilitiesExpense.value +
    payroll1.value +
    payroll2.value +
    internetExpense.value +
    cameraStorageExpense.value
  )
})

const totalVariableExpenses = computed(() => {
  return logisticsExpense.value + mpCommissionExpense.value
})

const totalOperationalExpenses = computed(() => {
  return totalFixedExpenses.value + totalVariableExpenses.value
})

const stockPurchaseNet = computed(() => {
  return manualSalesTotal.value * 0.62 - totalOperationalExpenses.value
})

const cashAmount = ref(0) // efectivo en caja
const mpSalesAmount = ref(0) // ventas MercadoPago

const combinedSalesTotal = computed(() => {
  return cashAmount.value + mpSalesAmount.value
})

const isSalesMatching = computed(() => {
  return combinedSalesTotal.value === manualSalesTotal.value
})

const differenceAmount = computed(() => {
  return combinedSalesTotal.value - manualSalesTotal.value
})

const differenceMessage = computed(() => {
  if (differenceAmount.value === 0) {
    return 'Todo cuadra perfecto'
  }

  if (differenceAmount.value > 0) {
    return `Excedes por $${differenceAmount.value.toFixed(2)}`
  }

  return `Te falta $${Math.abs(differenceAmount.value).toFixed(2)}`
})

// GASTOS FIJOS
const rentExpense = ref(270)
const utilitiesExpense = ref(50) // agua / luz
const payroll1 = ref(1200)
const payroll2 = ref(0)
const internetExpense = ref(100)
const cameraStorageExpense = ref(17)

// GASTOS VARIABLES
const logisticsExpense = ref(0) // gas, uber, caseta
const mpCommissionExpense = ref(0) // comisiones MP calculadas antes
</script>

<style lang="css">
h6,
h5 {
  margin: 0;
}
</style>
