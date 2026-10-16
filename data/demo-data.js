/**
 * LANDGUARD — Land Conflict Intelligence System
 * Synthetic Demo Dataset
 *
 * ALL DATA IS ENTIRELY FICTIONAL.
 * Names, plot IDs, deed IDs, and descriptions are invented for demonstration only.
 * This dataset does not represent any real land parcels, persons, or official records.
 * It must not be used for any legal, financial, or official purpose.
 */

const LANDGUARD_DATA = {

  // ─────────────────────────────────────────────
  // METADATA
  // ─────────────────────────────────────────────
  meta: {
    dataVersion: "1.0.0",
    description: "Synthetic demo dataset for LANDGUARD educational prototype.",
    disclaimer: "LANDGUARD is an educational prototype using synthetic demonstration data. It is not an official land-record verification service, legal opinion, or proof of fraud. Results indicate potential inconsistencies and require verification through authorized sources and qualified professionals.",
    lastUpdated: "2026-10-01"
  },

  // ─────────────────────────────────────────────
  // PLOTS
  // ─────────────────────────────────────────────
  plots: [

    // ── SCENARIO 1: Consistent Records ─────────
    {
      plotId: "PLT-2001",
      scenarioId: "scenario-1",
      scenarioLabel: "Consistent Records",
      location: "Greenfield Township, Block 7, Survey No. 112",
      area: "0.45 acres",
      landUse: "Residential",
      registrationDate: "2010-03-15",
      status: "Active",
      description: "All synthetic records agree. No conflict rules are triggered for this plot.",

      deeds: [
        {
          deedId: "DEED-7701",
          status: "Active",
          registeredOwner: "Amara Nwosu",
          registrationDate: "2010-03-15",
          registrationOffice: "Greenfield Sub-Registry",
          considerationAmount: "৳4,500,000",
          deedType: "Conveyance",
          witnessName: "Chukwuemeka Eze",
          verificationStatus: "Verified"
        }
      ],

      mutations: [
        {
          mutationId: "MUT-4401",
          recordedOwner: "Amara Nwosu",
          mutationDate: "2010-05-20",
          previousOwner: "Bola Adeyemi",
          mutationReason: "Sale",
          approvedBy: "Revenue Inspector Olawale",
          status: "Approved"
        }
      ],

      transferHistory: [
        {
          transferId: "TXF-001",
          fromOwner: "Bola Adeyemi",
          toOwner: "Amara Nwosu",
          date: "2010-03-15",
          transferType: "Sale",
          deedRef: "DEED-7701",
          mutationRef: "MUT-4401",
          notes: "Straightforward sale. All records consistent."
        }
      ],

      encumbrances: [],
      currentOwner: "Amara Nwosu",
      dataCompleteness: "Complete",
      missingFields: []
    },

    // ── SCENARIO 2: Ownership Mismatch ─────────
    {
      plotId: "PLT-2002",
      scenarioId: "scenario-2",
      scenarioLabel: "Ownership Mismatch",
      location: "Riverstone Estate, Block 3, Survey No. 87",
      area: "0.62 acres",
      landUse: "Mixed Use",
      registrationDate: "2015-07-22",
      status: "Active",
      description: "Deed and mutation records show different recorded owner names. This is the key conflict indicator.",

      deeds: [
        {
          deedId: "DEED-8802",
          status: "Active",
          registeredOwner: "Fatima Okonkwo",
          registrationDate: "2015-07-22",
          registrationOffice: "Riverstone Land Registry",
          considerationAmount: "৳8,200,000",
          deedType: "Conveyance",
          witnessName: "Adaeze Chukwu",
          verificationStatus: "Verified"
        }
      ],

      mutations: [
        {
          mutationId: "MUT-5502",
          recordedOwner: "Emmanuel Tarfa",   // ← MISMATCH: different name from deed
          mutationDate: "2015-09-10",
          previousOwner: "Grace Danladi",
          mutationReason: "Sale",
          approvedBy: "Revenue Inspector Musa",
          status: "Approved"
        }
      ],

      transferHistory: [
        {
          transferId: "TXF-002",
          fromOwner: "Grace Danladi",
          toOwner: "Fatima Okonkwo",
          date: "2015-07-22",
          transferType: "Sale",
          deedRef: "DEED-8802",
          mutationRef: null,
          notes: "Deed transfer to Fatima Okonkwo."
        },
        {
          transferId: "TXF-003",
          fromOwner: "Grace Danladi",
          toOwner: "Emmanuel Tarfa",
          date: "2015-09-10",
          transferType: "Sale",
          deedRef: null,
          mutationRef: "MUT-5502",
          notes: "Mutation record reflects a different owner than the deed."
        }
      ],

      encumbrances: [],
      currentOwner: "Disputed",
      dataCompleteness: "Partial",
      missingFields: ["Linked mutation for DEED-8802", "Deed reference for MUT-5502"]
    },

    // ── SCENARIO 3: Duplicate Active Deeds ─────
    {
      plotId: "PLT-2003",
      scenarioId: "scenario-3",
      scenarioLabel: "Duplicate Active Deeds",
      location: "Palmview Heights, Block 12, Survey No. 203",
      area: "0.38 acres",
      landUse: "Residential",
      registrationDate: "2012-11-08",
      status: "Under Review",
      description: "Two active deed records are associated with this plot ID. Both claim full ownership. This requires manual investigation.",

      deeds: [
        {
          deedId: "DEED-9901",
          status: "Active",
          registeredOwner: "Ngozi Adaeze Obiora",
          registrationDate: "2012-11-08",
          registrationOffice: "Palmview Land Registry",
          considerationAmount: "৳6,750,000",
          deedType: "Conveyance",
          witnessName: "Peter Nnadi",
          verificationStatus: "Verified"
        },
        {
          deedId: "DEED-9902",
          status: "Active",   // ← DUPLICATE ACTIVE DEED
          registeredOwner: "Sunday Ikenna Eze",
          registrationDate: "2018-04-25",
          registrationOffice: "Central Land Bureau — Annex B",
          considerationAmount: "৳11,000,000",
          deedType: "Conveyance",
          witnessName: "Kelechi Okafor",
          verificationStatus: "Pending Review"
        }
      ],

      mutations: [
        {
          mutationId: "MUT-6603",
          recordedOwner: "Ngozi Adaeze Obiora",
          mutationDate: "2013-01-14",
          previousOwner: "Emeka Obi",
          mutationReason: "Sale",
          approvedBy: "Revenue Inspector Eze",
          status: "Approved"
        }
      ],

      transferHistory: [
        {
          transferId: "TXF-004",
          fromOwner: "Emeka Obi",
          toOwner: "Ngozi Adaeze Obiora",
          date: "2012-11-08",
          transferType: "Sale",
          deedRef: "DEED-9901",
          mutationRef: "MUT-6603",
          notes: "Original sale. Records consistent up to this point."
        },
        {
          transferId: "TXF-005",
          fromOwner: "Unknown / Not Recorded",
          toOwner: "Sunday Ikenna Eze",
          date: "2018-04-25",
          transferType: "Sale",
          deedRef: "DEED-9902",
          mutationRef: null,
          notes: "Second deed issued years later. No mutation record. No clear chain from prior owner."
        }
      ],

      encumbrances: [
        {
          type: "Dispute Flag",
          raisedDate: "2018-07-01",
          raisedBy: "Registry Quality Control",
          notes: "Duplicate deed indicator noted in internal audit."
        }
      ],
      currentOwner: "Disputed",
      dataCompleteness: "Partial",
      missingFields: ["Deed reference for MUT-6603 mutation chain", "Prior ownership evidence for DEED-9902"]
    },

    // ── SCENARIO 4: Incomplete Records ─────────
    {
      plotId: "PLT-2004",
      scenarioId: "scenario-4",
      scenarioLabel: "Incomplete Records",
      location: "Westgate Quarters, Block 2, Survey No. 55",
      area: "Unknown",
      landUse: "Agricultural",
      registrationDate: "1998-06-01",
      status: "Inactive / Legacy",
      description: "Legacy record with significant missing information. Several key fields are absent, making conflict analysis incomplete.",

      deeds: [
        {
          deedId: "DEED-1100",
          status: "Unknown",
          registeredOwner: "Yakubu Musa Tanko",
          registrationDate: "1998-06-01",
          registrationOffice: "Westgate District Office",
          considerationAmount: null,
          deedType: "Customary Right of Occupancy",
          witnessName: null,
          verificationStatus: "Unverified"
        }
      ],

      mutations: [],  // No mutation record available

      transferHistory: [
        {
          transferId: "TXF-006",
          fromOwner: null,
          toOwner: "Yakubu Musa Tanko",
          date: "1998-06-01",
          transferType: "Original Grant",
          deedRef: "DEED-1100",
          mutationRef: null,
          notes: "Original grant. No subsequent mutation or transfer records found in the demo dataset."
        }
      ],

      encumbrances: [],
      currentOwner: "Yakubu Musa Tanko (unverified)",
      dataCompleteness: "Incomplete",
      missingFields: [
        "Plot area / survey dimensions",
        "Mutation records",
        "Consideration amount",
        "Witness information",
        "Verification status of existing deed"
      ]
    },

    // ── EXTRA PLOT: Consistent (for dashboard variety)
    {
      plotId: "PLT-2005",
      scenarioId: "scenario-1",
      scenarioLabel: "Consistent Records",
      location: "Crescent Gardens, Block 5, Survey No. 178",
      area: "0.55 acres",
      landUse: "Residential",
      registrationDate: "2019-09-05",
      status: "Active",
      description: "Clean records. Deed and mutation agree on owner. Transfer history is chronologically consistent.",

      deeds: [
        {
          deedId: "DEED-3301",
          status: "Active",
          registeredOwner: "Chinwe Adaora Obi",
          registrationDate: "2019-09-05",
          registrationOffice: "Crescent Sub-Registry",
          considerationAmount: "৳12,000,000",
          deedType: "Conveyance",
          witnessName: "Obioma Nwosu",
          verificationStatus: "Verified"
        }
      ],

      mutations: [
        {
          mutationId: "MUT-7705",
          recordedOwner: "Chinwe Adaora Obi",
          mutationDate: "2019-10-22",
          previousOwner: "Ifeanyi Mbah",
          mutationReason: "Sale",
          approvedBy: "Revenue Inspector Okafor",
          status: "Approved"
        }
      ],

      transferHistory: [
        {
          transferId: "TXF-007",
          fromOwner: "Ifeanyi Mbah",
          toOwner: "Chinwe Adaora Obi",
          date: "2019-09-05",
          transferType: "Sale",
          deedRef: "DEED-3301",
          mutationRef: "MUT-7705",
          notes: "All records consistent. No conflicts detected."
        }
      ],

      encumbrances: [],
      currentOwner: "Chinwe Adaora Obi",
      dataCompleteness: "Complete",
      missingFields: []
    },

    // ── EXTRA PLOT: Another Mismatch
    {
      plotId: "PLT-2006",
      scenarioId: "scenario-2",
      scenarioLabel: "Ownership Mismatch",
      location: "Hilltop View Estate, Block 9, Survey No. 320",
      area: "0.71 acres",
      landUse: "Commercial",
      registrationDate: "2021-01-15",
      status: "Active",
      description: "Deed owner and mutation owner do not match. Transfer date chronology also appears inconsistent.",

      deeds: [
        {
          deedId: "DEED-5501",
          status: "Active",
          registeredOwner: "Tunde Abiodun",
          registrationDate: "2021-01-15",
          registrationOffice: "Hilltop Commercial Registry",
          considerationAmount: "৳25,000,000",
          deedType: "Conveyance",
          witnessName: "Akin Olawale",
          verificationStatus: "Verified"
        }
      ],

      mutations: [
        {
          mutationId: "MUT-8806",
          recordedOwner: "Rashida Al-Amin",  // ← MISMATCH
          mutationDate: "2021-02-20",
          previousOwner: "Cynthia Osei",
          mutationReason: "Sale",
          approvedBy: "Revenue Inspector Bello",
          status: "Approved"
        }
      ],

      transferHistory: [
        {
          transferId: "TXF-008",
          fromOwner: "Cynthia Osei",
          toOwner: "Tunde Abiodun",
          date: "2021-01-15",
          transferType: "Sale",
          deedRef: "DEED-5501",
          mutationRef: null,
          notes: "Deed records sale to Tunde Abiodun."
        },
        {
          transferId: "TXF-009",
          fromOwner: "Cynthia Osei",
          toOwner: "Rashida Al-Amin",
          date: "2021-02-20",
          transferType: "Sale",
          deedRef: null,
          mutationRef: "MUT-8806",
          notes: "Mutation records a different buyer. Prior owner is the same (Cynthia Osei), suggesting a possible double-sale scenario."
        }
      ],

      encumbrances: [],
      currentOwner: "Disputed",
      dataCompleteness: "Partial",
      missingFields: ["Linked mutation for DEED-5501", "Deed reference for MUT-8806"]
    },

    // ── SCENARIO 5: Medium Risk — Incomplete Ownership History ──
    {
      plotId: "PLT-2007",
      scenarioId: "scenario-5",
      scenarioLabel: "Medium Risk — Incomplete Ownership History",
      location: "Maplewood District, Block 4, Survey No. 241",
      area: "0.52 acres",
      landUse: "Residential",
      registrationDate: "2014-03-10",
      status: "Active",
      description: "The recorded deed and mutation owners match. However, the incomplete ownership transfer history prevents a complete assessment. An intermediate transfer lacks deed and mutation references, requiring further manual verification.",

      deeds: [
        {
          deedId: "DEED-1004",
          status: "Active",
          registeredOwner: "Adaeze Nwofor",
          registrationDate: "2014-03-10",
          registrationOffice: "Maplewood Land Registry",
          considerationAmount: "৳9,500,000",
          deedType: "Conveyance",
          witnessName: "Chidi Eze",
          verificationStatus: "Verified"
        }
      ],

      mutations: [
        {
          mutationId: "MUT-9901",
          recordedOwner: "Adaeze Nwofor",
          mutationDate: "2014-05-18",
          previousOwner: "Obiageli Okonkwo",
          mutationReason: "Sale",
          approvedBy: "Revenue Inspector Adamu",
          status: "Approved"
        }
      ],

      transferHistory: [
        {
          transferId: "TXF-010",
          fromOwner: "Obiageli Okonkwo",
          toOwner: "Adaeze Nwofor",
          date: "2014-03-10",
          transferType: "Sale",
          deedRef: "DEED-1004",
          mutationRef: "MUT-9901",
          notes: "Original verified sale. Deed and mutation records are consistent."
        },
        {
          transferId: "TXF-011",
          fromOwner: null,
          toOwner: "Adaeze Nwofor",
          date: "2016-08-22",
          transferType: "Internal Transfer",
          deedRef: null,
          mutationRef: null,
          notes: "An intermediate transfer was recorded in 2016 without supporting deed or mutation references. The ownership chain for this period cannot be fully verified."
        }
      ],

      encumbrances: [],
      currentOwner: "Adaeze Nwofor",
      dataCompleteness: "Partial",
      missingFields: [
        "Deed reference for 2016 internal transfer (TXF-011)",
        "Mutation reference for 2016 internal transfer (TXF-011)"
      ]
    }

  ] // end plots

}; // end LANDGUARD_DATA

