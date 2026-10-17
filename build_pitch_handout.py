import os
import sys
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def build_executive_handout():
    doc = docx.Document()
    
    # 0.7 inch margins for high-impact print density
    for section in doc.sections:
        section.top_margin = Inches(0.65)
        section.bottom_margin = Inches(0.65)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)
        
        # Header
        hp = section.header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run("SolariQ | Competition Pitch & Executive Briefing Handout")
        hrun.font.name = "Calibri"
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = RGBColor(120, 120, 120)
        
        # Footer
        fp = section.footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("SolariQ: Adaptive Solar & Edge-AI Canal-Agri Framework  •  Page ")
        frun.font.name = "Calibri"
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = RGBColor(120, 120, 120)
        fld = parse_xml(r'<w:fldSimple %s w:instr="PAGE"/>' % nsdecls('w'))
        fp._p.append(fld)

    # Palette
    C_FOREST = RGBColor(0x06, 0x4E, 0x3B)    # Deep Emerald #064E3B
    C_FOREST_HEX = "064E3B"
    C_TEAL = RGBColor(0x0F, 0x76, 0x6E)      # Teal #0F766E
    C_TEAL_HEX = "0F766E"
    C_AMBER = RGBColor(0xB4, 0x53, 0x09)     # Amber #B45309
    C_AMBER_HEX = "B45309"
    C_DARK = RGBColor(0x11, 0x18, 0x27)      # Slate #111827
    C_MUTED = RGBColor(0x4B, 0x55, 0x63)     # Muted #4B5563
    
    BG_LIGHT = "F9FAFB"
    BG_EMERALD = "ECFDF5"
    BG_AMBER = "FFFBEB"
    BG_BLUE = "EFF6FF"
    BORDER_COLOR = "D1D5DB"

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=100, bottom=100, left=130, right=130):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{m}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def set_table_borders(table, color="D1D5DB", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        tblBorders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(tblBorders)

    def add_section_header(title, subtitle=None):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        
        r1 = p.add_run(title)
        r1.font.name = "Calibri"
        r1.font.size = Pt(12)
        r1.font.bold = True
        r1.font.color.rgb = C_FOREST
        
        if subtitle:
            r2 = p.add_run(f" — {subtitle}")
            r2.font.name = "Calibri"
            r2.font.size = Pt(9.5)
            r2.font.italic = True
            r2.font.color.rgb = C_TEAL

    # =========================================================================
    # 1. HEADER BANNER
    # =========================================================================
    p_head = doc.add_paragraph()
    p_head.paragraph_format.space_before = Pt(0)
    p_head.paragraph_format.space_after = Pt(2)
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    r_title = p_head.add_run("SOLARIQ: ADAPTIVE SOLAR & EDGE-AI CANAL-AGRI FRAMEWORK\n")
    r_title.font.name = "Calibri"
    r_title.font.size = Pt(15)
    r_title.font.bold = True
    r_title.font.color.rgb = C_FOREST
    
    r_sub = p_head.add_run("Judge & Government Quick-Briefing  |  Field Scenario, Value Matrix & Verified Economic Data\n")
    r_sub.font.name = "Calibri"
    r_sub.font.size = Pt(10)
    r_sub.font.bold = True
    r_sub.font.color.rgb = C_TEAL

    r_loc = p_head.add_run("Testbed: Kurigram (Dharla Basin)  •  Focus: BWDB Re-Excavated Canals  •  Team SolariQ")
    r_loc.font.name = "Calibri"
    r_loc.font.size = Pt(9)
    r_loc.font.italic = True
    r_loc.font.color.rgb = C_MUTED

    # Box: Core Pitch Motto
    t_motto = doc.add_table(rows=1, cols=1)
    t_motto.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_motto = t_motto.cell(0, 0)
    c_motto.width = Inches(7.1)
    set_cell_background(c_motto, BG_EMERALD)
    set_cell_margins(c_motto, top=90, bottom=90, left=130, right=130)
    
    pm = c_motto.paragraphs[0]
    pm.paragraph_format.space_before = Pt(0)
    pm.paragraph_format.space_after = Pt(0)
    
    rm1 = pm.add_run("★ OUR NORTH STAR MOTTO (Speaking Chunk for Judges):\n")
    rm1.font.name = "Calibri"
    rm1.font.size = Pt(9.5)
    rm1.font.bold = True
    rm1.font.color.rgb = C_FOREST
    
    rm2 = pm.add_run(
        "\"Our primary proposal is NOT merely converting natural resources into energy. "
        "We are here to show how MINIMIZING natural resource use (water, soil, pump runtimes) "
        "MAXIMIZES surplus clean electricity into the National Grid while generating rich climate returns.\""
    )
    rm2.font.name = "Calibri"
    rm2.font.size = Pt(9.5)
    rm2.font.italic = True
    rm2.font.color.rgb = C_DARK

    # =========================================================================
    # 2. THE GROUND SCENARIO (Speaking Chunks)
    # =========================================================================
    add_section_header("1. The Real Ground Scenario", "The Problem in Rural Bangladesh")

    p_sc = doc.add_paragraph()
    p_sc.paragraph_format.space_before = Pt(2)
    p_sc.paragraph_format.space_after = Pt(4)
    p_sc.paragraph_format.line_spacing = 1.15
    
    # 4 Chunk Lines for the Presenter
    chunks_scene = [
        ("• [THE GOVERNMENT CONTEXT]: ", "Across Bangladesh (e.g. Kurigram), the Government has re-excavated canals through agricultural lands to supply surface water and promote solar irrigation instead of costly diesel pumps."),
        ("• [THE LAND DILEMMA]: ", "Ground solar panels consume scarce fertile farmland. Placing panels over the canal utilizes public water rights-of-way with ZERO arable land loss while cutting water evaporation."),
        ("• [THE UNSEEN BOTTLENECK]: ", "Farmers operate pumps blindly by habit, routinely over-pumping by 10 to 20 minutes per plot. This drowns root zones, wastes water, and robs the national grid of solar electricity."),
        ("• [OUR SCENARIO INNOVATION]: ", "GeoAI maps each plot's AWD water deficit. It runs the pump ONLY for the required minutes (e.g., 10 min), sounds an alert, switches fields, and diverts 100% of the pump's power into the National Grid!")
    ]
    for tag, desc in chunks_scene:
        p_chunk = doc.add_paragraph()
        p_chunk.paragraph_format.space_before = Pt(1)
        p_chunk.paragraph_format.space_after = Pt(2)
        p_chunk.paragraph_format.line_spacing = 1.1
        
        rt = p_chunk.add_run(tag)
        rt.font.name = "Calibri"
        rt.font.size = Pt(9.5)
        rt.font.bold = True
        rt.font.color.rgb = C_AMBER
        
        rd = p_chunk.add_run(desc)
        rd.font.name = "Calibri"
        rd.font.size = Pt(9)
        rd.font.color.rgb = C_DARK

    # =========================================================================
    # 3. CORE COMPARATIVE TABLE: WHAT WE PROPOSE vs WHAT IT BENEFITS
    # =========================================================================
    add_section_header("2. Core Comparative Matrix", "Two-Part Value Breakdown")

    t_matrix = doc.add_table(rows=6, cols=2)
    t_matrix.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_matrix, color=BORDER_COLOR, sz="6", val="single")
    col_w = [Inches(3.35), Inches(3.75)]

    # Header Row
    headers = [
        "WHAT WE ARE PROPOSING\n(Technical Framework)", 
        "WHAT IT BENEFITS (Verified Impact & Ref.)\n(Tangible Climate & Economic Gains)"
    ]
    for i, h in enumerate(headers):
        c = t_matrix.cell(0, i)
        c.width = col_w[i]
        set_cell_background(c, C_FOREST_HEX)
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    # 5 Pillars
    pillars = [
        (
            "1. Canal-Top Solar Canopy\n"
            "• Overhead PV truss covering re-excavated public canal reaches.\n"
            "• SREDA-approved Tier-1 modules (625–630 Wp).",
            
            "✔ 100% Farmland Conserved: Zero agricultural land acquisition.\n"
            "✔ Evaporation Suppressed: Shading saves ~4,658 m³ of water/yr per 100m canal (de Oliveira et al., 2024).\n"
            "✔ PV Efficiency Boost: Canal water cooling increases solar electrical efficiency by +3.8%."
        ),
        (
            "2. GeoAI & Edge-IoT AWD Controller\n"
            "• Real-time capacitive soil moisture + AWD tube monitoring.\n"
            "• Stops pumping immediately when root-zone quota is met (e.g. 10 min for 10-decimal plot).",
            
            "✔ 25–30% Water Volume Saved: Prevents deep percolation waste.\n"
            "✔ 35–40% Rice Methane Cut: Aerobic-anaerobic cycling drastically reduces anaerobic methane emissions (BRRI, 2020).\n"
            "✔ Eliminates 10–20 min over-pumping waste per session."
        ),
        (
            "3. Automated 6-Way Valve Manifold\n"
            "• 1 central solar submersible pump serving 6 smallholder plots.\n"
            "• 9-minute audible chime alert + automatic solenoid valve sequencing.",
            
            "✔ Solves 'Tragedy of the Commons': Delivers strictly equitable water based on crop need; ends smallholder disputes.\n"
            "✔ Hardware Protection: Auto-cutoff protects pump from dry-run."
        ),
        (
            "4. Dynamic Grid Bypass & Rain-Lock Mode\n"
            "• When pump shuts off, 100% of solar pump load (e.g. 4.2 kW / 5 HP) is diverted directly to the 33kV National Grid.\n"
            "• Rain sensor locks pump OFF; 100% solar exported.",
            
            "✔ Every Saved Minute = Clean Grid kWh: 10 min daily saved = 300 min (5 hours) of pump power to the grid monthly!\n"
            "✔ Supports Summer Peak Loads: Injects clean electricity during high daytime urban air-conditioning demand.\n"
            "✔ Avoids Diesel: Displaces costly diesel fuel with zero emissions."
        ),
        (
            "5. Year-Round 365-Day Net-Metering\n"
            "• Operates across all 4 seasons (Boro dry irrigation, monsoon grid export, winter cash-crop micro-irrigation).\n"
            "• Net-metered under SREDA Guidelines 2025.",
            
            "✔ 100% Asset Utilization: Traditional solar pumps sit idle 7–8 months; SolariQ generates revenue 365 days/year.\n"
            "✔ Cooperative Income: Turns smallholders into energy entrepreneurs."
        )
    ]

    for r_idx, (p_text, b_text) in enumerate(pillars, start=1):
        row = t_matrix.rows[r_idx]
        bg = BG_LIGHT if r_idx % 2 == 1 else "FFFFFF"
        
        # Col 0: Propose
        c0 = row.cells[0]
        c0.width = col_w[0]
        set_cell_background(c0, bg)
        set_cell_margins(c0, top=80, bottom=80, left=110, right=110)
        p0 = c0.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.15
        lines0 = p_text.split('\n')
        r0 = p0.add_run(lines0[0] + "\n")
        r0.font.name = "Calibri"
        r0.font.size = Pt(9)
        r0.font.bold = True
        r0.font.color.rgb = C_FOREST
        for l in lines0[1:]:
            rl = p0.add_run(l + "\n")
            rl.font.name = "Calibri"
            rl.font.size = Pt(8.5)
            rl.font.color.rgb = C_DARK

        # Col 1: Benefits
        c1 = row.cells[1]
        c1.width = col_w[1]
        set_cell_background(c1, bg)
        set_cell_margins(c1, top=80, bottom=80, left=110, right=110)
        p1 = c1.paragraphs[0]
        p1.paragraph_format.line_spacing = 1.15
        lines1 = b_text.split('\n')
        for l in lines1:
            rl = p1.add_run(l + "\n")
            rl.font.name = "Calibri"
            rl.font.size = Pt(8.5)
            if "✔" in l:
                rl.font.bold = True
                rl.font.color.rgb = C_TEAL
            else:
                rl.font.color.rgb = C_DARK

    # =========================================================================
    # 4. OVERALL ADVANTAGE / USP (Presenter Chunks)
    # =========================================================================
    add_section_header("3. Overall Advantage & Unique Selling Proposition (USP)", "Why We Win")

    t_usp = doc.add_table(rows=1, cols=3)
    t_usp.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_usp, color=BORDER_COLOR, sz="4", val="single")
    usp_w = [Inches(2.35), Inches(2.35), Inches(2.4)]
    
    usps = [
        ("USP 1: Resource Minimization = Energy Maximization",
         "Traditional solar irrigation only asks: 'Can we pump with solar?' SolariQ asks: 'How fast can we stop pumping so surplus solar feeds the National Grid?' Cutting 10 min daily pumping yields 300 minutes of clean grid export per month!"),
        ("USP 2: Zero Land Conflict in Dense Bangladesh",
         "Bangladesh cannot afford to lose arable rice land to ground-mounted solar farms. SolariQ turns public water corridors into utility-scale clean power generators without displacing a single crop."),
        ("USP 3: 365-Day Year-Round Economic Asset",
         "Conventional solar pumps are idle 240+ days a year (terrible capital recovery). SolariQ feeds the grid continuously in monsoon and dry season alike under official SREDA Net-Metering Guidelines 2025.")
    ]
    for i, (ut, ub) in enumerate(usps):
        c = t_usp.cell(0, i)
        c.width = usp_w[i]
        set_cell_background(c, BG_AMBER)
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.paragraph_format.line_spacing = 1.15
        
        ru1 = p.add_run(ut + "\n")
        ru1.font.name = "Calibri"
        ru1.font.size = Pt(9)
        ru1.font.bold = True
        ru1.font.color.rgb = C_AMBER
        
        ru2 = p.add_run(ub)
        ru2.font.name = "Calibri"
        ru2.font.size = Pt(8.5)
        ru2.font.color.rgb = C_DARK

    # =========================================================================
    # 5. HARD QUANTIFIED NUMBERS & VERIFIED REFERENCES (NO HALLUCINATIONS)
    # =========================================================================
    add_section_header("4. Why Judges & Government Must Take This", "Verified Numbers from calculations.docx")

    # The 6 Exact Metric Rows
    roi_data = [
        ("Canal Reach & Plant Capacity", 
         "100 m canal length × 25 m width = 2,500 m² footprint\n"
         "405 kWp – 462.5 kWp (648 to 740 modules @ 625Wp)", 
         "Ref: SREDA Approved Module List (BDS IEC standards; 625Wp LONGi/Trina models)."),
        
        ("Daily Clean Solar Generation", 
         "1,490 – 1,956 kWh / day\n"
         "(544 – 714 MWh / year)", 
         "Ref: Global Solar Atlas (World Bank) Bangladesh resource: 3.68 – 4.23 kWh/kWp/day."),
        
        ("Irrigation Consumption (5 HP Pump)", 
         "33 – 35 kWh / day (at 8h/day pumping)\n"
         "(Only 12.1 – 12.8 MWh / year)", 
         "Ref: 5 HP motor (3.73 kW mech., 4.15–4.39 kW elec. @ 85–90% efficiency). Pumping uses <3% of total solar!"),
        
        ("Surplus Clean Power to National Grid", 
         "1,455 – 1,923 kWh / day exported!\n"
         "(531 – 702 MWh / year net grid feed)", 
         "Ref: Power Division, Ministry of Power (2025) Net Metering Guideline–2025. 97% of daily output feeds grid!"),
        
        ("Financial Revenue & Fuel Savings", 
         "BDT 1,250,000+ / year (~12.5 Lakh BDT/yr revenue)\n"
         "+ BDT 5,820/season diesel savings per 6-plot cluster", 
         "Ref: SREDA / BERC bulk feed-in tariff credit + avoided diesel fuel expenses."),
        
        ("Avoided Carbon & Climate Credits", 
         "329 – 443 Metric Tonnes CO2e / year avoided!\n"
         "+ 35% reduction in rice field methane (CH4)", 
         "Ref: Official Department of Environment GEF = 0.62 tCO2/MWh (Jan 23, 2025); BRRI (2020) AWD GHG data.")
    ]

    t_roi = doc.add_table(rows=len(roi_data) + 1, cols=3)
    t_roi.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(t_roi, color=BORDER_COLOR, sz="4", val="single")
    roi_w = [Inches(2.2), Inches(2.5), Inches(2.4)]

    # Header
    roi_heads = ["Key Metric Parameter", "Quantified Value (100m Canal Reach)", "Official Government Reference"]
    for i, h in enumerate(roi_heads):
        c = t_roi.cell(0, i)
        c.width = roi_w[i]
        set_cell_background(c, "1E293B")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.font.name = "Calibri"
        r.font.size = Pt(8.5)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    for r_idx, (col0, col1, col2) in enumerate(roi_data, start=1):
        row = t_roi.rows[r_idx]
        bg = BG_LIGHT if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, text in enumerate([col0, col1, col2]):
            c = row.cells[c_idx]
            c.width = roi_w[c_idx]
            set_cell_background(c, bg)
            set_cell_margins(c, top=70, bottom=70, left=90, right=90)
            p = c.paragraphs[0]
            p.paragraph_format.line_spacing = 1.15
            run = p.add_run(text)
            run.font.name = "Calibri"
            run.font.size = Pt(8.5)
            if c_idx == 0:
                run.font.bold = True
                run.font.color.rgb = C_FOREST
            elif c_idx == 1:
                run.font.bold = True
                run.font.color.rgb = C_AMBER
            else:
                run.font.italic = True
                run.font.color.rgb = C_MUTED

    # =========================================================================
    # 6. CLOSING SUMMARY (30-Second Elevator Pitch)
    # =========================================================================
    p_close = doc.add_paragraph()
    p_close.paragraph_format.space_before = Pt(8)
    p_close.paragraph_format.space_after = Pt(2)
    p_close.paragraph_format.line_spacing = 1.15
    
    rc1 = p_close.add_run("THE 30-SECOND ELEVATOR PITCH FOR JUDGES: ")
    rc1.font.name = "Calibri"
    rc1.font.size = Pt(9.5)
    rc1.font.bold = True
    rc1.font.color.rgb = C_FOREST
    
    rc2 = p_close.add_run(
        "\"Government dug the canals; SolariQ powers them. Instead of letting solar pumps run blindly and waste water, "
        "our GeoAI runs the pump for the exact minutes needed, cuts 35% rice methane, and instantly diverts 97% of the clean electricity "
        "into the National Grid. It turns public canals into continuous BDT 1.25 Million annual revenue streams without taking a single inch of fertile farmland.\""
    )
    rc2.font.name = "Calibri"
    rc2.font.size = Pt(9)
    rc2.font.italic = True
    rc2.font.color.rgb = C_DARK

    # Save
    out_path = os.path.abspath("SolariQ_Executive_Pitch_Handout.docx")
    doc.save(out_path)
    print(f"Handout successfully regenerated at: {out_path}")

if __name__ == "__main__":
    build_executive_handout()
