import React from 'react';
import { Page, Text, Font, View, Document, StyleSheet } from '@react-pdf/renderer';
import fontRegular from '../../assets/fonts/Nasu-Regular.ttf';  // ttfファイル参照
import fontBold from '../../assets/fonts/Nasu-Bold.ttf';        // ttfファイル参照

const DocumentPDF = ({
  workflows, flowsteps, checklists,
  showingChecklistsOnDocument, showingFlowstepDescriptionsOnDocument
}) => {
  const workflowName = workflows[0]?.name;

  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>{workflowName}</Text>

        {flowsteps.length === 0 ? (
          <Text style={styles.content}>フローステップはまだありません。</Text>
        ) : (
          flowsteps.map((flowstep, index) => (
            <View key={flowstep.id}>
              <Text style={styles.chapter}>{index + 1}: {flowstep.name}</Text>
              <Text style={styles.content}>
                {flowstep.members ? flowstep.members.map(member => member.name).join(', ') + ' は ' + flowstep.name + ' を行う。' : 'Unknown Member が行うタスク'}
              </Text>
              {showingFlowstepDescriptionsOnDocument &&　(
              <Text style={styles.supplementContent}>
                {flowstep.description}
              </Text>
              )}

              {/* チェックリストの表示 */}
              {checklists[flowstep.flow_number]?.length > 0 && showingChecklistsOnDocument && (
                <View style={styles.checklistContainer}>
                  <Text style={styles.checklistsTitle}>チェック項目:</Text>
                  {checklists[flowstep.flow_number].map((checklist) => (
                    <Text key={checklist.id} style={styles.checklistItem}>
                      • {checklist.name}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </Page>
    </Document>
  );
};

Font.register({
  family: 'Nasu-Regular',
  src: fontRegular
});

Font.register({
  family: 'Nasu-Bold',
  src: fontBold
});

const styles = StyleSheet.create({
  body: { padding: 30 },
  header: { fontSize: 12, textAlign: 'center', marginBottom: 20, fontFamily: 'Nasu-Regular' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 10, fontFamily: 'Nasu-Bold' },
  chapter: { fontSize: 18, marginVertical: 6, fontFamily: 'Nasu-Bold' },
  checklistsTitle: { fontSize: 18, marginVertical: 6, fontFamily: 'Nasu-Bold' },
  content: { fontSize: 18, marginBottom: 6, fontFamily: 'Nasu-Regular' },
  supplementContent: { fontSize: 16, marginBottom: 6, fontFamily: 'Nasu-Regular' },
  checklistContainer: { marginVertical: 10, padding: 5, fontFamily: 'Nasu-Regular' },
  checklistItem: { fontSize: 18, marginVertical: 2, fontFamily: 'Nasu-Regular', marginLeft: 10 }, // インデントを追加
});

export default DocumentPDF;
