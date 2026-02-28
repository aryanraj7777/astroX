const { GoogleGenerativeAI } = require("@google/generative-ai");

// Securely access the key from Vercel Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, dob, tob, pob } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are a Master Vedic Astrologer. 
        User: ${name}, Born: ${dob} at ${tob} in ${pob}.
        
        Provide a reading in 4 distinct sections using bold HTML headers (<h3>):
        1. <h3>📜 Your Karmic Blueprint</h3> (Analyze past life influences).
        2. <h3>🌟 Current Planetary Period (Dasha)</h3> (Explain current life phase).
        3. <h3>🔮 The 2026-2027 Destiny</h3> (Specific career/health prediction).
        4. <h3>💎 Sacred Remedies</h3> (Suggest one Mantra and one Gemstone).

        Tone: Mystical and ancient. Use 200 words. Format with <p> tags for readability.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.status(200).json({ data: response.text() });
    } catch (error) {
        res.status(500).json({ error: "The stars are obscured." });
    }
}
