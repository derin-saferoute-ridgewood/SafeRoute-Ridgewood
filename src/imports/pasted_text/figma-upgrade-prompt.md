<figma_make_upgrade_prompt>
  <project>
    <name>SafeRoute+ Bergen</name>
    <scope>
      Upgrade the existing SafeRoute+ prototype rather than rebuilding it from scratch.
      Preserve the existing orange-first design language, route-planning flow, route results,
      street detail view, active trip view, and “How it works” design direction where useful.
     
      Add a complete public-facing homepage / launch page, a robust transparency disclosure system,
      a dedicated “How calculations work” page, and a build-ready map integration specification.
    </scope>
    <product_statement>
      SafeRoute+ helps children, older adults, families, and general pedestrians choose walking
      routes that prioritize pedestrian-friendly street characteristics—not travel time alone.
    </product_statement>
    <pilot_scope>
      Pilot area: Ridgewood, New Jersey.
      Brand identity: SafeRoute+ Bergen.
      Expansion story: Built for Bergen County, beginning with Ridgewood.
    </pilot_scope>
  </project>

  <critical_art_direction>
    <preserve>
      Preserve the warm orange brand, cream canvas, flat outlined controls, rounded type,
      tactile orange CTAs, navy text accents, teal positive-status color, and civic-navigation feel
      already present in the existing prototype.
    </preserve>

    <quality_standard>
      The interface must look designed, intentional, and production-ready—not “generated.”
      Keep layouts calm, disciplined, responsive, readable, and grounded in real product decisions.
      Prioritize strong typography, real hierarchy, meaningful map states, and empty space.
    </quality_standard>

    <strict_no_ai_slop>
      Do not introduce:
      gradients, glassmorphism, glowing objects, neon, purple-blue AI SaaS styling,
      decorative blobs, fake 3D objects, generic robot/AI imagery, excessive shadows,
      fake dashboards, meaningless charts, overuse of pills, overuse of cards,
      stock-photo people, uncanny generated people, generic startup copy,
      giant hollow headlines, vague “AI-powered” claims, or cluttered interfaces.

      Do not use generic AI-generated illustrations unless they can match a genuinely
      professional flat-vector illustration standard.

      If that illustration standard cannot be met, use a clearly labeled editable placeholder
      with a subtle cream fill, orange outline, fixed aspect ratio, and this label:
      “Illustration placeholder — replace with commissioned SafeRoute+ vector artwork.”

      It is better to have an elegant placeholder than low-quality artificial-looking artwork.
    </strict_no_ai_slop>

    <illustration_policy>
      Existing illustrations may remain only if they look clean, flat, original, and visually consistent.
      Improve them only through clean vector geometry, restrained color, and professional composition.
      No mascots. No copied Duolingo characters. No visual imitation of the Duolingo owl.
     
      Use illustration subjects only when useful:
      pedestrians, sidewalks, crosswalks, neighborhood homes, transit, trees,
      wayfinding signs, benches, road markings, and Ridgewood civic details.
    </illustration_policy>
  </critical_art_direction>

  <design_tokens>
    <colors>
      <token name="route-orange" value="#F26A21" usage="Primary CTA, active route, selected state, key emphasis"/>
      <token name="deep-orange" value="#D94E0D" usage="Pressed state, active border, strong orange emphasis"/>
      <token name="tangerine" value="#FF9A3D" usage="Secondary orange accents and small illustration details"/>
      <token name="soft-peach" value="#FFE3CC" usage="Selected cards, supporting orange surfaces"/>
      <token name="pale-cream" value="#FFF1E6" usage="Subtle section wash"/>
      <token name="paper-cream" value="#FFF9F4" usage="Global page background"/>
      <token name="paper-white" value="#FFFFFF" usage="Cards, inputs, map sheets, content surfaces"/>
      <token name="ink" value="#263238" usage="Primary heading and text color"/>
      <token name="slate" value="#5E6B70" usage="Secondary copy and metadata"/>
      <token name="navy" value="#18384A" usage="Navigation, high-contrast labels, dark visual anchors"/>
      <token name="border" value="#CDD4D6" usage="Neutral 2px outlines"/>
      <token name="suitability-teal" value="#168B82" usage="Positive street features and higher suitability"/>
      <token name="teal-wash" value="#D8F4EE" usage="Positive surfaces"/>
      <token name="attention-yellow" value="#F6BD31" usage="Sunset, timing, and moderate route conditions"/>
      <token name="yellow-wash" value="#FFF3C9" usage="Timing advisory surface"/>
      <token name="route-blue" value="#2774C7" usage="Fastest-route visual identity and neutral information"/>
      <token name="caution-red" value="#D9534F" usage="Low-suitability street factors only"/>
      <token name="red-wash" value="#FCE3E0" usage="Caution surface"/>
    </colors>

    <typography>
      <display>
        Use Nunito Black, Nunito ExtraBold, or an equivalent rounded display sans.
        Weight 800–900. Use for major headlines only.
        Desktop: 48–56px. Mobile: 32–40px.
        Line height: 1.1–1.2. Letter spacing: -0.02em.
      </display>
      <body>
        Use Inter, Nunito Sans, or a clean geometric sans.
        Body size: 16–17px. Supporting text: 14–15px.
        Labels and buttons: 14–15px, weight 700.
      </body>
    </typography>

    <surfaces>
      <rule>
        Use flat white cards on a warm cream background.
        Use 12px card radius and crisp 2px borders.
        Avoid visual noise and unnecessary elevation.
      </rule>
      <rule>
        Shadows should be absent or extremely subtle. Use borders and fill changes
        instead of blurred drop shadows to indicate interactivity.
      </rule>
    </surfaces>
  </design_tokens>

  <new_page id="homepage" name="SafeRoute+ Homepage / Launch Page">
    <purpose>
      Create the actual homepage users and Congressional App Challenge judges see first.
      It should explain the value proposition immediately, let users start routing immediately,
      and establish the Ridgewood pilot without pretending the full county is already live.
    </purpose>

    <responsive_layout>
      <desktop>
        Use a centered 1200px content width over paper-cream background.
        Keep the primary route card prominent in the upper viewport.
        Place map preview below the route controls or as a balanced adjacent panel,
        depending on available width.
      </desktop>
      <mobile>
        Stack content vertically with generous spacing.
        Keep the route card, profile selector, slider, and primary CTA above the fold.
        Use a compact map preview below them.
      </mobile>
    </responsive_layout>

    <section id="top_bar">
      <layout>
        <left>
          Use the existing SafeRoute+ Bergen logo asset.
          Under the logo or directly beside it, show the short descriptive line:
          “Safer walking routes for children, older adults, and families.”
        </left>
        <right>
          <icon_button icon="guardian shield" label="Guardian Mode"/>
          <icon_button icon="settings or user profile" label="Settings"/>
          <icon_button icon="info circle" label="Help and information"/>
        </right>
      </layout>
      <mobile_behavior>
        Keep logo at left. Put Guardian Mode first, followed by a compact overflow/menu button
        that reveals Settings and Help.
      </mobile_behavior>
      <interaction>
        Guardian Mode opens the existing Guardian Mode setup flow.
        Help opens the transparency / how-it-works overview.
      </interaction>
    </section>

    <section id="intro">
      <eyebrow>RIDGEWOOD PILOT</eyebrow>
      <headline>Find a walking route that fits the person walking.</headline>
      <body>
        SafeRoute+ compares travel time with pedestrian-friendly street characteristics,
        helping you make more informed walking decisions.
      </body>
      <trust_note>
        Scores describe route characteristics. They do not guarantee safety or predict crashes.
      </trust_note>
    </section>

    <section id="primary_route_card">
      <purpose>
        This is the homepage’s dominant element. It should be visually strongest,
        occupy meaningful space, and make route creation feel immediate.
      </purpose>

      <style>
        White surface, 2px neutral border, 16px radius, generous 24–32px padding.
        On desktop, give this card enough width to feel like the central product interaction.
        Use no gradient, no dashboard clutter, and no unnecessary extra controls.
      </style>

      <route_fields>
        <field id="from">
          <label>From</label>
          <placeholder>Current location</placeholder>
          <icon>Orange origin pin</icon>
          <supporting_action>Use my location</supporting_action>
        </field>

        <route_connector>
          Use a simple dotted vertical route connector between origin and destination.
          Include a discreet swap-locations icon.
        </route_connector>

        <field id="to">
          <label>To</label>
          <placeholder>Where are you going?</placeholder>
          <icon>Navy destination pin</icon>
        </field>
      </route_fields>

      <route_profile>
        <label>Who is this route for?</label>
        <helper_text>
          Different people may prefer different street and crossing conditions.
        </helper_text>

        <profile_cards>
          <profile default="false" id="child">
            <icon>Child / teen pedestrian icon, not emoji</icon>
            <title>Child / teen</title>
            <description>Prioritizes simpler crossings, slower roads, and pedestrian-friendly streets.</description>
          </profile>

          <profile default="true" id="general">
            <icon>General pedestrian icon, not emoji</icon>
            <title>General</title>
            <description>Balances route time with everyday pedestrian-friendly street features.</description>
          </profile>

          <profile default="false" id="older_adult">
            <icon>Older adult pedestrian icon, not emoji</icon>
            <title>Older adult</title>
            <description>Prioritizes shorter crossings, sidewalks, gentler routes, and lower-stress streets.</description>
          </profile>
        </profile_cards>

        <selected_style>
          Selected profile uses soft-peach background, 3px route-orange border,
          orange checkmark, and clear selected label.
          Unselected profiles remain white with neutral 2px outline.
        </selected_style>
      </route_profile>

      <safety_time_slider>
        <label>What matters most?</label>
        <visual>
          A horizontal slider with visible endpoints:
          Faster on the left and Safer on the right.
          Use continuous movement visually but snap the MVP to three states:
          Fastest, Balanced, Safest.
        </visual>

        <default_state>Balanced</default_state>

        <dynamic_copy>
          <state name="Fastest">
            <title>Fastest</title>
            <description>Prioritizes a shorter walking time.</description>
          </state>
          <state name="Balanced">
            <title>Balanced</title>
            <description>Adds up to a few minutes to favor pedestrian-friendly streets.</description>
          </state>
          <state name="Safest">
            <title>Safer</title>
            <description>Prioritizes calmer streets and simpler crossings, within a reasonable detour limit.</description>
          </state>
        </dynamic_copy>

        <interaction>
          Slider state updates its label and route preference label.
          Do not falsely imply that every intermediate slider pixel changes the backend.
          The MVP may map the visual slider to 3–5 discrete routing values.
        </interaction>
      </safety_time_slider>

      <primary_action>
        <button>Find a Safer Route</button>
        <button_style>
          Route Orange fill, white text, 48px minimum height, 12px radius,
          tactile deep-orange pressed state, no gradient.
        </button_style>
      </primary_action>

      <microcopy>
        Ridgewood Pilot. Route scores are estimates based on available street data and selected preferences.
      </microcopy>
    </section>

    <section id="guardian_mode_card">
      <purpose>
        Make Guardian Mode visible but clearly secondary to routing.
        It should feel like a privacy-centered option, not a surveillance product.
      </purpose>

      <style>
        White or pale-cream card with a subtle orange icon surface,
        2px border, 12px radius, and compact horizontal layout on desktop.
      </style>

      <content>
        <icon>Guardian shield with checkmark</icon>
        <title>Guardian Mode</title>
        <headline>Stay connected without constant tracking.</headline>
        <body>
          Set voluntary arrival reminders, share an “I’m OK” update,
          request a pickup, or recalculate after a route deviation.
        </body>
        <feature_labels>
          <label>✓ Check-in reminders</label>
          <label>✓ Request pickup</label>
          <label>✓ Route deviation alerts</label>
        </feature_labels>
        <action>Set up Guardian Mode →</action>
      </content>

      <privacy_rule>
        Never say “monitor,” “track,” “surveil,” “automatically alert,” or “live location sharing.”
        Clearly state that the user reviews and sends any message.
      </privacy_rule>
    </section>

    <section id="map_preview">
      <purpose>
        Add a compact, visually impressive but restrained Ridgewood map preview below routing controls.
        Do not make the first screen a giant generic map.
      </purpose>

      <map_visual>
        Use a simple map panel with Ridgewood streets, a current-location blue dot,
        clean local road labels, small parks, a few landmarks, and a small visible route example.
        Use warm off-white land, pale gray streets, navy labels, muted green parks,
        and orange only for selected route emphasis.
      </map_visual>

      <safety_layer_toggle>
        <label>Show pedestrian suitability layer</label>
        <default_state>Off</default_state>
        <when_on>
          Show only a light, sparse visual overlay:
          teal = more pedestrian-friendly,
          yellow = mixed conditions,
          muted red = use extra care.
         
          Do not turn the map into a dense heatmap.
          Keep road labels and route visibility clear.
        </when_on>
      </safety_layer_toggle>

      <map_note>
        Suitability colors are a visual guide based on available street characteristics,
        not a guarantee that a street is safe.
      </map_note>
    </section>

    <section id="why_saferoute">
      <position>Below the fold</position>
      <headline>Why SafeRoute+?</headline>

      <three_value_cards>
        <card>
          <icon>Route profile icon</icon>
          <title>Personalized</title>
          <text>Routes change for children, older adults, and general pedestrians.</text>
        </card>

        <card>
          <icon>Street detail / info icon</icon>
          <title>Explainable</title>
          <text>See why individual streets receive higher or lower suitability ratings.</text>
        </card>

        <card>
          <icon>Privacy shield icon</icon>
          <title>Privacy-first</title>
          <text>Guardian Mode uses voluntary check-ins rather than permanent tracking.</text>
        </card>
      </three_value_cards>
    </section>

    <section id="local_identity">
      <style>
        Use a pale-cream or soft-peach band with restrained civic illustration placeholder
        or a clean local map-outline graphic. Keep it elegant and not promotional.
      </style>

      <eyebrow>BUILT FOR BERGEN COUNTY</eyebrow>
      <headline>Starting with Ridgewood.</headline>
      <body>
        SafeRoute+ uses local roadway and pedestrian data to help residents make more informed walking decisions.
      </body>

      <pilot_status>
        <active>Pilot area: Ridgewood, NJ</active>
        <coming_soon>Englewood — Coming soon</coming_soon>
        <coming_soon>Hackensack — Coming soon</coming_soon>
        <coming_soon>Paramus — Coming soon</coming_soon>
      </pilot_status>

      <rule>
        Do not imply active coverage outside Ridgewood.
        “Coming soon” areas should be visibly inactive and clearly labeled.
      </rule>
    </section>

    <section id="homepage_footer">
      <left>
        <logo_text>SafeRoute+ Bergen</logo_text>
        <copyright>© 2026 SafeRoute+ Bergen. Ridgewood Pilot.</copyright>
      </left>

      <right>
        <link>How it works</link>
        <link>Privacy</link>
        <link>Accessibility</link>
        <link prominent="true">How are calculations made?</link>
      </right>

      <transparency_disclosure>
        <text>
          SafeRoute+ does not predict the exact probability of injury.
          It compares pedestrian suitability using observable roadway characteristics
          and the route preferences selected by the user.
        </text>
        <link>Read the full methodology →</link>
      </transparency_disclosure>
    </section>
  </new_page>

  <new_page id="transparency_page" name="SafeRoute+ Transparency: How Our Calculations Work">
    <purpose>
      Build a dedicated, detailed, readable methodology page linked from:
      1) the footer,
      2) the homepage help icon,
      3) a “How was this calculated?” link beneath every route suitability score,
      4) specific street-detail factor breakdowns.

      This page must be credible enough for a Congressional App Challenge judge,
      clear enough for a parent, and restrained enough to feel honest.
    </purpose>

    <top_bar>
      <left>SafeRoute+ Bergen logo</left>
      <center_or_left_title>How our calculations work</center_or_left_title>
      <right>Back to route planner</right>
    </top_bar>

    <hero>
      <eyebrow>TRANSPARENT ROUTING</eyebrow>
      <headline>How SafeRoute+ compares walking routes.</headline>
      <body>
        SafeRoute+ does not predict the exact probability that someone will be injured.
        Instead, it calculates a relative pedestrian suitability score from observable roadway
        and pedestrian-infrastructure characteristics, then compares possible routes using
        both suitability and travel time.
      </body>

      <plain_language_callout>
        <title>What does 85/100 mean?</title>
        <text>
          An 85 does not mean a route is “85% safe.”
          It means that, under SafeRoute+’s current transparent model,
          the route has more pedestrian-friendly characteristics than routes with lower scores.
        </text>
      </plain_language_callout>
    </hero>

    <information_architecture>
      Use editable accordion sections with concise overview text first,
      then expandable equation, example, parameter, and limitation content.
      Do not force ordinary users to read an enormous wall of mathematics.
    </information_architecture>

    <accordion_section id="principle" title="1. What SafeRoute+ calculates">
      <plain_english>
        Streets are represented as a network of walkable road segments and intersections.
        Each segment receives a relative-risk value from observable characteristics.
        SafeRoute+ then finds routes that balance time and pedestrian suitability
        according to the selected profile and Faster-to-Safer preference.
      </plain_english>

      <key_distinction>
        SafeRoute+ estimates route characteristics. It does not guarantee safety,
        predict individual behavior, or claim to calculate an exact crash probability.
      </key_distinction>
    </accordion_section>

    <accordion_section id="segment_risk" title="2. Street-segment risk score">
      <formula>
        R_e = Σ (w_i × x_i)
      </formula>

      <definitions>
        <item>R_e = overall relative risk for street segment e</item>
        <item>x_i = normalized value of roadway or pedestrian factor i</item>
        <item>w_i = transparent model weight for factor i</item>
      </definitions>

      <example_formula>
        R_e = w_sS + w_lL + w_aA + w_cC + w_iI + w_hH + w_pP − w_gG
      </example_formula>

      <factor_definitions>
        <factor>S = speed-risk score</factor>
        <factor>L = lane-count or road-width score</factor>
        <factor>A = arterial-road score</factor>
        <factor>C = crossing-complexity score</factor>
        <factor>I = intersection-risk score</factor>
        <factor>H = historical crash component, if reliable local data is available</factor>
        <factor>P = pedestrian-infrastructure penalty</factor>
        <factor>G = protective crossing benefit, such as marked or signalized pedestrian crossings</factor>
      </factor_definitions>

      <note>
        All components are normalized to approximately 0–1 before weighting.
        This prevents raw measurements, such as speed in miles per hour,
        from overpowering the other characteristics merely because their raw values are larger.
      </note>
    </accordion_section>

    <accordion_section id="normalization" title="3. Normalizing roadway features">
      <formula>
        x_norm = (x − x_min) / (x_max − x_min)
      </formula>

      <example>
        If the observed speed range is 20–50 mph:
        a 35 mph segment has normalized speed value (35 − 20) / (50 − 20) = 0.50.
        A 45 mph segment has normalized speed value (45 − 20) / (50 − 20) = 0.83.
      </example>

      <nonlinear_speed_option>
        <title>Higher-speed penalty</title>
        <formula>
          S = ((v − v_min) / (v_max − v_min))²
        </formula>
        <text>
          Squaring the normalized value makes higher vehicle speeds disproportionately costly,
          which better reflects the pedestrian-focused purpose of the model.
        </text>
        <examples>
          <item>25 mph → 0.028</item>
          <item>35 mph → 0.250</item>
          <item>45 mph → 0.694</item>
        </examples>
      </nonlinear_speed_option>
    </accordion_section>

    <accordion_section id="street_features" title="4. Features included in the current model">
      <feature_table>
        <row factor="Vehicle speed" method="Normalized, potentially nonlinear speed penalty" meaning="Higher speeds add more concern"/>
        <row factor="Lanes / road width" method="1–2 lanes lower concern; 4+ lanes higher concern" meaning="Wider roads and crossings can be harder to navigate"/>
        <row factor="Road class" method="OpenStreetMap road classification" meaning="Residential roads are generally lower concern than primary or trunk roads"/>
        <row factor="Sidewalk availability" method="Both sides / one side / unknown / no sidewalk" meaning="Unknown is not treated the same as no sidewalk"/>
        <row factor="Crossing complexity" method="Lanes, width, turning movements, signalization, major-road connection" meaning="Complicated crossings add concern"/>
        <row factor="Intersection complexity" method="Explicit intersection penalty" meaning="A difficult crossing should not disappear inside a mostly calm route"/>
        <row factor="Slope" method="Normalized grade where reliable terrain data is available" meaning="Especially relevant to Older Adult mode"/>
        <row factor="Historical crashes" method="Optional proximity-and-recency weighted input" meaning="Never the only basis for a route score"/>
      </feature_table>

      <data_caution>
        Road and sidewalk data can be incomplete. SafeRoute+ does not automatically interpret
        missing OpenStreetMap attributes as missing infrastructure.
      </data_caution>
    </accordion_section>

    <accordion_section id="road_class" title="5. Road type and sidewalk handling">
      <road_class_values>
        <row road_type="residential" relative_value="0.10"/>
        <row road_type="service" relative_value="0.25"/>
        <row road_type="tertiary" relative_value="0.40"/>
        <row road_type="secondary" relative_value="0.65"/>
        <row road_type="primary" relative_value="0.85"/>
        <row road_type="trunk" relative_value="1.00"/>
      </road_class_values>

      <sidewalk_values>
        <row sidewalk_data="Sidewalks on both sides" penalty="0.00"/>
        <row sidewalk_data="Sidewalk on one side" penalty="0.25"/>
        <row sidewalk_data="Sidewalk status unknown" penalty="0.65"/>
        <row sidewalk_data="No sidewalk" penalty="1.00"/>
      </sidewalk_values>

      <disclosure>
        These are transparent model parameters, not universal scientific constants.
        Weights and rules are tested, documented, and refined through transportation guidance,
        local user testing, and expert feedback.
      </disclosure>
    </accordion_section>

    <accordion_section id="intersection" title="6. Crossing and intersection complexity">
      <formula>
        C = 0.30L_n + 0.25T + 0.20W + 0.15U + 0.10M
      </formula>

      <definitions>
        <item>L_n = normalized number of lanes</item>
        <item>T = turning complexity</item>
        <item>W = crossing width</item>
        <item>U = unsignalized-crossing indicator</item>
        <item>M = major-road indicator</item>
      </definitions>

      <plain_english>
        SafeRoute+ gives difficult intersections explicit weight because a short,
        complex crossing can matter more than the average conditions along an entire block.
      </plain_english>
    </accordion_section>

    <accordion_section id="crash_history" title="7. Historical crash data, when available">
      <formula>
        h_j = severity_j × e^(−λd_j) × e^(−γt_j)
      </formula>
      <formula>
        H = min(1, K × Σh_j)
      </formula>

      <definitions>
        <item>d_j = distance from street segment to crash j</item>
        <item>t_j = age of crash j</item>
        <item>λ = distance-decay parameter</item>
        <item>γ = time-decay parameter</item>
        <item>K = calibration constant</item>
      </definitions>

      <plain_english>
        A recent pedestrian crash near a segment can matter more than an old event far away.
        However, crash history is only one factor and never defines a route by itself.
      </plain_english>

      <data_limit>
        If reliable, sufficiently geocoded local pedestrian crash data is unavailable,
        this component should be omitted or clearly labeled unavailable rather than guessed.
      </data_limit>
    </accordion_section>

    <accordion_section id="profiles" title="8. Why profile scores differ">
      <intro>
        Different pedestrians can experience the same route differently.
        The model changes its factor weights according to the selected routing profile.
      </intro>

      <general_model>
        <title>General pedestrian model</title>
        <formula>
          R_general = 0.25S + 0.15L + 0.15A + 0.20C + 0.10H + 0.15P
        </formula>
      </general_model>

      <child_model>
        <title>Child / teen model</title>
        <formula>
          R_child = 0.30S + 0.18L + 0.17A + 0.23C + 0.07H + 0.05P
        </formula>
        <text>
          Child / teen mode gives additional weight to vehicle speed,
          crossing complexity, road width, and major arterials.
        </text>
      </child_model>

      <older_adult_model>
        <title>Older adult model</title>
        <formula>
          R_senior = 0.18S + 0.10L + 0.10A + 0.22C + 0.05H + 0.20P + 0.15Q
        </formula>
        <text>
          Older Adult mode gives additional weight to sidewalks, crossings,
          intersection difficulty, and slope Q when reliable terrain data is available.
        </text>
      </older_adult_model>

      <governance_note>
        Model weights are versioned and documented. They are not hidden constants.
        Example label: “Child / Teen model v1.0.”
      </governance_note>
    </accordion_section>

    <accordion_section id="route_score" title="9. From street scores to route suitability">
      <formula>
        R_route_average = [Σ(d_e × R_e)] / [Σd_e]
      </formula>

      <plain_english>
        Route risk is distance-weighted. A difficult condition lasting 600 meters
        affects the score more than one lasting only 10 meters.
      </plain_english>

      <peak_penalty>
        <title>Peak-risk adjustment</title>
        <formula>
          R_route_final = (1 − β)R_average + βR_max
        </formula>
        <example>
          With β = 0.20, a route averaging 0.25 but containing one 0.85 high-concern segment
          receives a higher final concern value. This keeps one difficult crossing
          from disappearing inside an otherwise calm route.
        </example>
      </peak_penalty>

      <suitability_formula>
        <formula>Suitability_route = 100 × (1 − R_route_final)</formula>
        <example>
          If final route risk equals 0.25, the suitability score is 75/100.
        </example>
      </suitability_formula>
    </accordion_section>

    <accordion_section id="routing" title="10. How the Faster-to-Safer slider changes a route">
      <intro>
        Travel time and pedestrian suitability use different units, so both are normalized
        before SafeRoute+ compares them.
      </intro>

      <travel_time>
        <formula>T_e = d_e / v_w</formula>
        <text>
          d_e is segment length and v_w is assumed walking speed.
          For future versions, users may optionally choose relaxed, normal, or brisk walking pace
          rather than having pace assigned by age.
        </text>
      </travel_time>

      <time_normalization>
        <formula>T'_r = (T_r − T_min) / (T_max − T_min)</formula>
      </time_normalization>

      <edge_cost>
        <formula>C_e(α) = αT'_e + (1 − α)R_e</formula>
        <definitions>
          <item>α = user preference value controlled by the Faster-to-Safer slider</item>
          <item>Higher α gives more weight to time</item>
          <item>Lower α gives more weight to pedestrian suitability</item>
        </definitions>
      </edge_cost>

      <slider_examples>
        <row preference="Fastest" alpha="0.90" meaning="90% time weight, 10% suitability weight"/>
        <row preference="Balanced" alpha="0.50" meaning="Equal time and suitability weight"/>
        <row preference="Safer" alpha="0.15" meaning="15% time weight, 85% suitability weight"/>
      </slider_examples>

      <algorithm>
        SafeRoute+ then uses a shortest-path algorithm such as Dijkstra or A*
        to identify the route with the lowest total weighted cost.
      </algorithm>
    </accordion_section>

    <accordion_section id="detours" title="11. Preventing unreasonable detours">
      <formula>
        T_route ≤ (1 + δ) × T_fastest
      </formula>

      <examples>
        <row preference="Fastest" maximum_extra_time="5%"/>
        <row preference="Balanced" maximum_extra_time="20%"/>
        <row preference="Safer" maximum_extra_time="35%"/>
      </examples>

      <plain_english>
        SafeRoute+ normally avoids recommending a dramatically longer route just to avoid one street.
        For example, if the fastest route takes 20 minutes and the safer setting allows 35% extra time,
        the route should generally remain at or under 27 minutes.
      </plain_english>
    </accordion_section>

    <accordion_section id="guardian_math" title="12. Guardian Mode calculations">
      <route_deviation>
        <formula>D = distance(current GPS position, planned route polyline)</formula>
        <trigger>
          Deviation = (D &gt; 150 meters) AND (time away from route &gt; 60 seconds)
        </trigger>
        <plain_english>
          SafeRoute+ waits for both distance and time before suggesting a check-in,
          helping reduce false alerts caused by normal GPS drift.
        </plain_english>
      </route_deviation>

      <late_arrival>
        <formula>Delay = Current Time − Original ETA</formula>
        <trigger>Prompt a check-in when Delay &gt; 5 minutes.</trigger>
        <rule>
          SafeRoute+ prompts the user. It does not automatically message a guardian.
        </rule>
      </late_arrival>

      <darkness>
        <formula>If ETA &gt; Sunset, then DarkTrip = 1.</formula>
        <plain_english>
          The MVP provides a timing advisory when a trip may continue after sunset.
          It does not claim to know real-time lighting conditions on individual streets.
        </plain_english>
      </darkness>
    </accordion_section>

    <accordion_section id="confidence" title="13. Missing data and confidence">
      <intro>
        A suitability score should not look more certain than the available data allows.
      </intro>

      <formula>
        Confidence_e = [Σ(w_i × a_i)] / [Σw_i]
      </formula>

      <definitions>
        <item>a_i = 1 if important data is available; 0 if it is missing</item>
        <item>Important missing attributes affect confidence more than minor missing attributes</item>
      </definitions>

      <route_confidence>
        <formula>
          Confidence_route = [Σ(d_e × Confidence_e)] / [Σd_e]
        </formula>
      </route_confidence>

      <ui_example>
        Show optional route metadata:
        “Suitability: 88/100 · Data confidence: 91%.”
      </ui_example>

      <rule>
        Never treat missing OpenStreetMap information as proof that infrastructure does not exist.
      </rule>
    </accordion_section>

    <accordion_section id="full_formula" title="14. The complete simplified model">
      <formula>
        R_e(u) = Σ[w_i(u) × x_i,e]
      </formula>
      <formula>
        S_e(u) = 100 × (1 − R_e(u))
      </formula>
      <formula>
        C_e = αT'_e + (1 − α)R_e(u)
      </formula>
      <formula>
        Route* = argmin over candidate routes of ΣC_e
      </formula>
      <constraint>
        Subject to: T_route ≤ (1 + δ) × T_fastest
      </constraint>
      <formula>
        R_average = [Σ(d_e × R_e)] / [Σd_e]
      </formula>
      <formula>
        R_final = (1 − β)R_average + βR_max
      </formula>
      <formula>
        Suitability_route = 100 × (1 − R_final)
      </formula>

      <plain_english>
        In short: SafeRoute+ scores street segments, adapts those scores for the person walking,
        balances suitability against time, prevents unreasonable detours, and explains the result.
      </plain_english>
    </accordion_section>

    <closing_disclosure>
      <headline>Use SafeRoute+ as one input—not a guarantee.</headline>
      <body>
        Conditions can change because of driver behavior, traffic, construction, weather,
        visibility, sidewalk closures, missing data, and many other factors.
        Always use personal judgment and follow traffic rules.
      </body>
    </closing_disclosure>
  </new_page>

  <route_score_disclosure_component>
    <purpose>
      Add this compact reusable component underneath every route score,
      including route result cards and street-detail score cards.
    </purpose>

    <content>
      <text>How was this calculated?</text>
      <subtext>View the factors, data confidence, and model version.</subtext>
      <icon>Information circle or transparent-routing icon</icon>
    </content>

    <interaction>
      Route result card opens a route-specific explanation bottom sheet first.
      That sheet includes:
      selected profile,
      Faster-to-Safer setting,
      route suitability score,
      data confidence percentage,
      top positive factors,
      top caution factors,
      route-duration tradeoff,
      “Open full methodology” link to the Transparency page.
    </interaction>
  </route_score_disclosure_component>

  <new_component id="route_calculation_breakdown_sheet">
    <purpose>
      Build a route-specific explanation sheet, not merely a generic score explanation.
    </purpose>

    <layout>
      <title>Why this route scored 81</title>
      <subtitle>Balanced route · Child / teen profile</subtitle>

      <score_row>
        <metric>Pedestrian suitability: 81/100</metric>
        <metric>Data confidence: 87%</metric>
      </score_row>

      <positive_factors>
        <item>Sidewalks along most of the route</item>
        <item>More residential streets</item>
        <item>Signalized crossing near destination</item>
      </positive_factors>

      <caution_factors>
        <item>One higher-speed crossing on Maple Avenue</item>
        <item>Moderate crossing complexity near East Ridgewood Avenue</item>
      </caution_factors>

      <tradeoff>
        This route adds 2 minutes compared with the fastest option and improves
        pedestrian suitability by 19 points.
      </tradeoff>

      <method_note>
        This is a route-characteristic estimate, not a prediction or guarantee of safety.
      </method_note>

      <action>Read full methodology</action>
    </layout>
  </new_component>

  <map_integration_specification>
    <purpose>
      Create a build-ready technical specification page or annotated developer handoff frame
      for the map implementation. The prototype should use realistic map UI states,
      while the actual build uses a free, high-quality, low-complexity map stack.
    </purpose>

    <recommended_stack>
      <frontend_map_library>
        Leaflet with React-Leaflet for the fastest beginner-friendly implementation.
      </frontend_map_library>

      <base_map>
        Use OpenStreetMap data with a free basemap provider that allows the intended usage,
        such as OpenStreetMap standard tiles for light prototype/development traffic
        while respecting attribution and tile-usage policy.

        For a more polished free visual style, use CARTO’s publicly available light basemap tiles
        only if their current terms permit the intended project usage and attribution is included.
      </base_map>

      <geocoding>
        For demo and light development use:
        OpenStreetMap Nominatim with a proper identifying User-Agent and strict rate-limit compliance.

        For the most reliable MVP demo, include a small curated list of Ridgewood locations:
        Ridgewood High School, Ridgewood Train Station, Ridgewood Public Library,
        downtown Ridgewood, Van Neste Square, and selected neighborhood destinations.

        Do not expose a secret API key inside the frontend.
      </geocoding>

      <routing>
        Backend: Python FastAPI.
        Street-network analysis: OSMnx + NetworkX.
        Data processing: GeoPandas.
        Routing algorithm: custom Dijkstra or A* with SafeRoute+ edge weights.

        Do not self-host OSRM, configure PostGIS, build native mobile apps,
        or require Google Maps Platform for the MVP.
      </routing>

      <api_key_policy>
        Preferred MVP: no paid API keys required.
        OpenStreetMap, Nominatim, OSMnx, Leaflet, NetworkX, GeoPandas, and FastAPI
        can support a student prototype without a paid key.

        If a third-party map provider token is used for a polished basemap,
        store it in environment variables and restrict it by domain.
        Never hard-code a secret API key into a Figma design, GitHub repository,
        public frontend bundle, screenshot, or demo video.
      </api_key_policy>

      <attribution>
        Always show visible map attribution in the live product:
        “© OpenStreetMap contributors” and any applicable tile-provider attribution.
      </attribution>

      <warning>
        Do not imply that OpenStreetMap data alone makes scores authoritative.
        Show data confidence and methodology disclosures.
      </warning>
    </recommended_stack>

    <map_ui_requirements>
      <requirement>Show a real interactive map region, not a static decorative image in the working app.</requirement>
      <requirement>Use a clean light basemap with readable street labels and limited visual clutter.</requirement>
      <requirement>Use orange for the selected SafeRoute+ route.</requirement>
      <requirement>Use blue for Fastest and teal for the most pedestrian-friendly alternative.</requirement>
      <requirement>Pair route colors with clear route labels and distinct line styles.</requirement>
      <requirement>Include a compact “Show pedestrian suitability layer” toggle.</requirement>
      <requirement>Keep safety layer off by default.</requirement>
      <requirement>Use a compact visible attribution footer on the map.</requirement>
    </map_ui_requirements>
  </map_integration_specification>

  <prototype_updates>
    <update>
      Make the new homepage the first prototype frame and default starting point.
    </update>

    <homepage_flow>
      Homepage → enter origin and destination → choose profile → adjust slider →
      Find a Safer Route → existing route results view.
    </homepage_flow>

    <guardian_flow>
      Homepage Guardian Mode icon/card → existing Guardian Mode setup →
      existing active trip screen → existing deviation prompt.
    </guardian_flow>

    <transparency_flow>
      Homepage footer → Transparency page.
      Homepage Help → Transparency page.
      Route score “How was this calculated?” → route calculation breakdown sheet →
      Transparency page.
    </transparency_flow>

    <route_result_improvement>
      Update the existing results view so it consistently displays:
      route name, duration, distance, suitability score, data confidence,
      plain-language route tradeoff, and “How was this calculated?”.
    </route_result_improvement>
  </prototype_updates>

  <final_quality_check>
    <requirement>
      The homepage must make route planning the central action, not Guardian Mode,
      not a heatmap, and not a generic marketing hero.
    </requirement>

    <requirement>
      General pedestrian must be the default profile. Do not assume every user is a child.
    </requirement>

    <requirement>
      The transparency page must explicitly state that scores are not injury probabilities,
      not crash predictions, and not guarantees of safety.
    </requirement>

    <requirement>
      Equations must be typeset cleanly and legibly with true mathematical hierarchy,
      not written as broken inline plain text.
    </requirement>

    <requirement>
      Keep the orange-first Duolingo-inspired warmth, but preserve SafeRoute+ as an original,
      trustworthy, civic-navigation brand.
    </requirement>

    <requirement>
      Use high-quality original vectors only when they meet a professional standard.
      Otherwise, use labeled illustration placeholders for future commissioned art.
    </requirement>

    <requirement>
      No AI slop: no gradients, glass, neon, fake data, generic startup visuals,
      unexplained dashboards, robotic copy, or decorative clutter.
    </requirement>

    <requirement>
      All major screens, route cards, profile states, map toggle states,
      score disclosure components, and footer links must remain editable,
      structured, reusable Figma components.
    </requirement>
  </final_quality_check>
</figma_make_upgrade_prompt>