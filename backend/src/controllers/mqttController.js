const mqtt = require('mqtt');

const mqttServer = "mqtt.eclipseprojects.io";
const mqttPort = 1883;
const mqttTopic = "esp32/subscribe";

const mqttClient = mqtt.connect(`mqtt://${mqttServer}:${mqttPort}`);
mqttClient.on('connect', () => {
    console.log('Connected to MQTT Broker');
});

mqttClient.on('error', (err) => {
    console.error('Failed to connect to MQTT Broker:', err);
});

exports.sendAcknowledgment = (req, res) => {
    try {
        const { acknowledgment } = req.body;

        if (typeof acknowledgment !== 'boolean') {
            return res.status(400).json({ error: 'Invalid acknowledgment value. Must be true or false.' });
        }

        const message = acknowledgment ? 'ON' : 'OFF';
        console.log(`Publishing MQTT message: ${message} to topic: ${mqttTopic}`);

        mqttClient.publish(mqttTopic, message, (err) => {
            if (err) {
                console.error('Failed to publish to MQTT:', err);
                return res.status(500).json({ error: 'Failed to send acknowledgment to ESP32.' });
            }

            console.log(`Acknowledgment sent to MQTT: ${message}`);
            res.status(200).json({ message: 'Acknowledgment sent successfully.', acknowledgment });
        });
    } catch (error) {
        console.error('Error in acknowledgment controller:', error);
        res.status(500).json({ error: error.message });
    }
};
