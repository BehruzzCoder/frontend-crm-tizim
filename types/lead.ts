export interface Lead {
  id: number;
  date: string;
  yangiLid: number;
  ishgaOlindi: number;
  aloqaOrnatildi: number;
  konsultatsiyaBerildi: number;
  qiziqishBildirdi: number;
  hisobRaqamYuborildi: number;
  preDaplata: number;
  toliqTolov: number;
  kotargan: number;
  kotarmagan: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadSummary {
  jamiLid: number;
  yangiLid: number;
  ishgaOlindi: number;
  aloqaOrnatildi: number;
  konsultatsiyaBerildi: number;
  qiziqishBildirdi: number;
  hisobRaqamYuborildi: number;
  preDaplata: number;
  toliqTolov: number;
  kotargan: number;
  kotarmagan: number;
}